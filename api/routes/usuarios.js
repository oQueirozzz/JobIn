import express from 'express';
import * as usuariosController from '../controllers/usuariosController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import NotificacaoService from '../services/notificacaoService.js';
import { protect } from '../middleware/authMiddleware.js';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Configuração do __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Caminho para a pasta public do frontend
    const uploadPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', 'usuarios');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: function (req, file, cb) {
    // Permitir imagens para foto de perfil
    if (file.fieldname === 'foto' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    }
    // Permitir PDFs e documentos para currículo e certificados
    else if ((file.fieldname === 'curriculo' || file.fieldname === 'certificados') && 
      (file.mimetype === 'application/pdf' || 
       file.mimetype === 'application/msword' || 
       file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      cb(null, true);
    }
    else {
      cb(new Error('Tipo de arquivo não permitido. Use imagens para foto e PDF/DOC para currículo/certificados.'), false);
    }
  }
});

// Middleware de autenticação simplificado
const authMiddleware = (req, res, next) => {
  next();
};

// Rotas públicas
router.post('/register', usuariosController.registerUsuario);
router.post('/login', usuariosController.loginUsuario);
router.get('/', usuariosController.getUsuarios);

// Rotas de redefinição de senha
router.post('/solicitar-codigo', async (req, res) => {
  const { email, codigo } = req.body;
  console.log('Solicitação de código para:', email);

  try {
    // Verificar se o email existe no banco de dados
    const queryText = 'SELECT id, email, nome FROM usuarios WHERE email = $1';
    const queryParams = [email];
    console.log('Verificando email existente:', queryText, queryParams);
    const result = await db.query(queryText, queryParams);
    const usuarios = result.rows;

    if (usuarios.length === 0) {
      console.log('Email não cadastrado:', email);
      return res.status(404).json({ message: 'Email não cadastrado no sistema' });
    }

    const userId = usuarios[0].id;

    // 1. Remover tokens existentes para este usuário/email
    console.log('Removendo tokens existentes para:', email);
    await db.query('DELETE FROM password_reset_tokens WHERE email = $1', [email]);

    // 2. Hashar o código recebido do frontend
    const salt = await bcrypt.genSalt(10);
    const codigoHash = await bcrypt.hash(codigo, salt);
    console.log('Código recebido (não hashado):', codigo);
    console.log('Código hasheado:', codigoHash);

    // 3. Calcular data de expiração (15 minutos)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    console.log('Token expira em:', expiresAt);

    // 4. Inserir novo token no banco de dados
    console.log('Inserindo novo token no DB...');
    await db.query(
      'INSERT INTO password_reset_tokens (user_id, email, token, expires_at) VALUES ($1, $2, $3, $4)',
      [userId, email, codigoHash, expiresAt]
    );
    console.log('Token inserido no DB');

    // 5. Configurar parâmetros para o EmailJS
    const templateParams = {
        to_email: email.trim().toLowerCase(),
        token: codigo,
        name: 'JobIn Support',
        from_email: 'suporte@jobin.com'
    };

    // 6. Enviar email com o código de verificação usando EmailJS
    console.log('Enviando email com código...');
    // await emailjs.send('service_r9l70po', 'template_0t894rd', templateParams);
    console.log('Email de redefinição (simulado) enviado para:', email, 'com código:', codigo);

    // Retornar resposta de sucesso
    return res.status(200).json({ 
      message: 'Código de verificação gerado e enviado para seu email.',
      success: true
    });

  } catch (error) {
    console.error('Erro ao processar solicitação de código:', error);
    return res.status(500).json({ 
      message: 'Erro no servidor ao solicitar código.',
      error: error.message
    });
  }
});

router.post('/verificar-codigo', async (req, res) => {
  const { email, codigo } = req.body;
  console.log('Verificando código para:', email, 'Código:', codigo);
  
  try {
    const emailNormalizado = email.trim().toLowerCase();
    
    // 1. Buscar token ativo para o email no banco de dados
    console.log('Buscando token ativo no DB para:', emailNormalizado);
    const result = await db.query(
      'SELECT * FROM password_reset_tokens WHERE email = $1 AND expires_at > NOW()',
      [emailNormalizado]
    );
    const tokenData = result.rows[0];

    if (!tokenData) {
      console.log('Nenhum token ativo ou válido encontrado para:', emailNormalizado);
      return res.status(400).json({ 
        message: 'Código inválido ou expirado. Solicite um novo código.' 
      });
    }
    
    // 2. Comparar o código fornecido com o hash no banco usando bcrypt
    console.log('Comparando código fornecido com hash do DB...');
    const isMatch = await bcrypt.compare(codigo.toUpperCase(), tokenData.token);

    if (!isMatch) {
      console.log('Código não corresponde para:', emailNormalizado);
      return res.status(400).json({ message: 'Código inválido' });
    }
    
    // 3. Código válido - Gerar um token de redefinição
    const tokenRedefinicao = await bcrypt.hash(Date.now().toString(), 10);
    
    // 4. Atualizar o token no banco de dados
    await db.query(
      'UPDATE password_reset_tokens SET token = $1 WHERE id = $2',
      [tokenRedefinicao, tokenData.id]
    );
    console.log('Token de redefinição atualizado no DB');

    // Retornar sucesso com o token de redefinição
    return res.status(200).json({ 
      message: 'Código verificado com sucesso',
      email: emailNormalizado,
      userId: tokenData.user_id,
      token: tokenRedefinicao
    });

  } catch (error) {
    console.error('Erro na verificação de código:', error);
    return res.status(500).json({
      message: 'Erro no servidor ao verificar código.',
      error: error.message
    });
  }
});

router.put('/redefinir-senha', async (req, res) => {
  console.log('=== ENDPOINT REDEFINIR SENHA CHAMADO ===');
  console.log('URL completa:', req.originalUrl);
  console.log('Método:', req.method);
  console.log('Body completo:', req.body);
  console.log('Headers:', req.headers);
  
  const { email, novaSenha } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;

  console.log('Dados recebidos para redefinição:', { 
    email, 
    token: !!token,
    novaSenha: !!novaSenha 
  });

  try {
    // Verificar se o email e token existem
    if (!email || !token || !novaSenha) {
      console.log('Dados faltando:', { 
        email: !!email, 
        token: !!token, 
        novaSenha: !!novaSenha 
      });
      return res.status(400).json({ 
        message: 'Email, token e nova senha são obrigatórios' 
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    console.log('Email normalizado:', emailNormalizado);

    // Verificar se o usuário existe
    const userResult = await db.query('SELECT id FROM usuarios WHERE email = $1', [emailNormalizado]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }

    // Verificar token de redefinição
    const tokenResult = await db.query(
      'SELECT * FROM password_reset_tokens WHERE email = $1 AND token = $2 AND expires_at > NOW()',
      [emailNormalizado, token]
    );

    if (tokenResult.rows.length === 0) {
      console.log('Token inválido ou expirado para:', emailNormalizado);
      return res.status(400).json({ 
        message: 'Token de redefinição inválido ou expirado. Por favor, solicite um novo código.' 
      });
    }
    
    // Hash da nova senha
    console.log('Hashando nova senha...');
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);
    console.log('Senha hashada.');

    // Atualizar senha no banco
    console.log('Atualizando senha no DB para user ID:', userResult.rows[0].id);
    const resultUpdate = await db.query(
      'UPDATE usuarios SET senha = $1 WHERE id = $2',
      [senhaHash, userResult.rows[0].id]
    );

    if (resultUpdate.rowCount === 0) {
      console.log('Erro ao atualizar senha no DB para user ID:', userResult.rows[0].id);
      return res.status(404).json({ 
        message: 'Erro ao atualizar senha.' 
      });
    }

    // Remover o token usado
    await db.query('DELETE FROM password_reset_tokens WHERE email = $1', [emailNormalizado]);
    console.log('Token usado removido do DB');
    
    // Criar notificação de senha alterada
    await NotificacaoService.criarNotificacaoSenhaAlterada(userResult.rows[0].id, 0, false);
    console.log('Notificação de senha alterada criada.');

    return res.json({ 
      message: 'Senha atualizada com sucesso!' 
    });
  } catch (error) {
    console.error('Erro completo:', error);
    return res.status(500).json({ 
      message: 'Erro no servidor',
      errorDetails: error.message
    });
  }
});

// Nova rota para alterar senha quando o usuário está autenticado
router.put('/alterar-senha-autenticado/:id', protect, usuariosController.updateSenha);

// Rotas protegidas
router.get('/perfil', protect, usuariosController.getPerfil);
router.put('/:id', protect, upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'curriculo', maxCount: 1 },
  { name: 'certificados', maxCount: 1 }
]), usuariosController.updateUsuario);
router.delete('/:id', protect, usuariosController.deleteUsuario);

// Rota para notificar atualização de perfil
router.post('/:id/notificar-perfil-atualizado', async (req, res) => {
    try {
        const { id } = req.params;
        await NotificacaoService.criarNotificacaoPerfilAtualizado(id, null, false);
        res.status(200).json({ message: 'Notificação criada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar notificação de perfil atualizado:', error);
        res.status(500).json({ message: 'Erro ao criar notificação' });
    }
});

// Remover o objeto em memória, pois não é mais usado
// const codigosVerificacao = {};

export default router;