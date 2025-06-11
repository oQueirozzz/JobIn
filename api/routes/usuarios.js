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

// Criar tabela password_reset_tokens se não existir
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL
  );
`;

db.query(createTableQuery)
  .then(() => console.log('Tabela password_reset_tokens verificada/criada com sucesso'))
  .catch(err => console.error('Erro ao criar tabela password_reset_tokens:', err));

// Rotas de redefinição de senha
router.post('/solicitar-codigo', async (req, res) => {
  const { email, codigo } = req.body;
  console.log('=== INÍCIO DA SOLICITAÇÃO DE CÓDIGO ===');
  console.log('Dados recebidos:', { email, codigo });
  
  try {
    if (!email || !codigo) {
      console.log('Dados incompletos:', { email: !!email, codigo: !!codigo });
      return res.status(400).json({ 
        message: 'Email e código são obrigatórios' 
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const codigoNormalizado = codigo.toUpperCase().trim();
    
    // 1. Verificar se o email existe
    console.log('Verificando email existente:', 
      'SELECT id, email, nome FROM usuarios WHERE email = $1', 
      [emailNormalizado]
    );
    const userResult = await db.query(
      'SELECT id, email, nome FROM usuarios WHERE email = $1',
      [emailNormalizado]
    );
    
    if (userResult.rows.length === 0) {
      console.log('Email não encontrado:', emailNormalizado);
      return res.status(404).json({ 
        message: 'Email não encontrado' 
      });
    }

    const user = userResult.rows[0];
    console.log('Usuário encontrado:', { 
      userId: user.id, 
      email: user.email 
    });

    // 2. Remover tokens existentes
    console.log('Removendo tokens existentes para:', emailNormalizado);
    const deleteResult = await db.query(
      'DELETE FROM password_reset_tokens WHERE email = $1 RETURNING *',
      [emailNormalizado]
    );
    console.log('Tokens removidos:', deleteResult.rows);

    // 3. Gerar hash do código
    const codigoHash = await bcrypt.hash(codigoNormalizado, 10);
    console.log('Código processado:', {
      original: codigo,
      normalizado: codigoNormalizado,
      hash: codigoHash
    });

    // 4. Inserir novo token com expiração automática
    console.log('Inserindo novo token no DB...');
    const insertResult = await db.query(
      `INSERT INTO password_reset_tokens 
       (user_id, email, token) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [user.id, emailNormalizado, codigoHash]
    );

    const insertedToken = insertResult.rows[0];
    console.log('Token inserido no DB:', {
      tokenId: insertedToken.id,
      email: insertedToken.email,
      expiresAt: insertedToken.expires_at,
      token: insertedToken.token
    });

    // 5. Verificar se o token foi inserido corretamente
    const verifyResult = await db.query(
      `SELECT *, 
       NOW() as current_time,
       expires_at > NOW() as is_active,
       EXTRACT(EPOCH FROM (expires_at - NOW())) as seconds_until_expiry
       FROM password_reset_tokens 
       WHERE id = $1`,
      [insertedToken.id]
    );

    console.log('Verificação do token inserido:', {
      encontrouToken: verifyResult.rows.length > 0,
      tokenId: verifyResult.rows[0]?.id,
      email: verifyResult.rows[0]?.email,
      expiresAt: verifyResult.rows[0]?.expires_at,
      currentTime: verifyResult.rows[0]?.current_time,
      isActive: verifyResult.rows[0]?.is_active,
      secondsUntilExpiry: verifyResult.rows[0]?.seconds_until_expiry,
      token: verifyResult.rows[0]?.token,
      query: `SELECT * FROM password_reset_tokens WHERE id = ${insertedToken.id}`
    });

    // 6. Verificar todos os tokens para este email
    const allTokensResult = await db.query(
      `SELECT *, 
       NOW() as current_time,
       expires_at > NOW() as is_active,
       EXTRACT(EPOCH FROM (expires_at - NOW())) as seconds_until_expiry
       FROM password_reset_tokens 
       WHERE email = $1`,
      [emailNormalizado]
    );
    console.log('Todos os tokens para este email:', allTokensResult.rows);

    console.log('=== SOLICITAÇÃO DE CÓDIGO CONCLUÍDA COM SUCESSO ===');
    return res.status(200).json({ 
      message: 'Código enviado com sucesso',
      email: emailNormalizado
    });

  } catch (error) {
    console.error('=== ERRO NA SOLICITAÇÃO DE CÓDIGO ===');
    console.error('Erro detalhado:', error);
    console.error('Stack trace:', error.stack);
    console.error('Dados que causaram o erro:', { email, codigo });
    return res.status(500).json({
      message: 'Erro no servidor ao solicitar código.',
      error: error.message
    });
  }
});

router.post('/verificar-codigo', async (req, res) => {
  const { email, codigo } = req.body;
  console.log('=== INÍCIO DA VERIFICAÇÃO DE CÓDIGO ===');
  console.log('Dados recebidos:', { email, codigo });
  
  try {
    if (!email || !codigo) {
      console.log('Dados incompletos:', { email: !!email, codigo: !!codigo });
      return res.status(400).json({ 
        message: 'Email e código são obrigatórios' 
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const codigoNormalizado = codigo.toUpperCase().trim();
    
    console.log('Dados normalizados:', { 
      emailNormalizado, 
      codigoNormalizado,
      codigoOriginal: codigo
    });
    
    // 1. Primeiro, verificar se existem tokens para este email, independente da data
    console.log('Verificando todos os tokens para:', emailNormalizado);
    const allTokensResult = await db.query(
      `SELECT *, 
       NOW() as current_time,
       expires_at > NOW() as is_active,
       EXTRACT(EPOCH FROM (expires_at - NOW())) as seconds_until_expiry
       FROM password_reset_tokens 
       WHERE email = $1`,
      [emailNormalizado]
    );
    console.log('Todos os tokens encontrados:', allTokensResult.rows);
    
    // 2. Buscar token ativo com mais detalhes
    console.log('Buscando token ativo no DB para:', emailNormalizado);
    const query = `
      SELECT *, 
      NOW() as current_time,
      expires_at > NOW() as is_active,
      EXTRACT(EPOCH FROM (expires_at - NOW())) as seconds_until_expiry
      FROM password_reset_tokens 
      WHERE email = $1 
      AND expires_at > NOW()
      ORDER BY expires_at DESC 
      LIMIT 1
    `;
    const result = await db.query(query, [emailNormalizado]);
    const tokenData = result.rows[0];

    console.log('Resultado da busca no DB:', {
      encontrouToken: !!tokenData,
      tokenId: tokenData?.id,
      tokenExpira: tokenData?.expires_at,
      tokenHash: tokenData?.token,
      emailEncontrado: tokenData?.email,
      currentTime: tokenData?.current_time,
      isActive: tokenData?.is_active,
      secondsUntilExpiry: tokenData?.seconds_until_expiry,
      query: query,
      params: [emailNormalizado]
    });

    if (!tokenData) {
      console.log('Nenhum token ativo ou válido encontrado para:', emailNormalizado);
      return res.status(400).json({ 
        message: 'Código inválido ou expirado. Solicite um novo código.' 
      });
    }
    
    // 3. Comparar o código fornecido com o hash no banco usando bcrypt
    console.log('Comparando código fornecido com hash do DB...');
    console.log('Hash armazenado:', tokenData.token);
    const isMatch = await bcrypt.compare(codigoNormalizado, tokenData.token);
    console.log('Resultado da comparação:', isMatch);

    if (!isMatch) {
      console.log('Código não corresponde para:', emailNormalizado);
      return res.status(400).json({ message: 'Código inválido' });
    }
    
    // 4. Código válido - Gerar um token de redefinição
    const tokenRedefinicao = await bcrypt.hash(Date.now().toString(), 10);
    
    // 5. Atualizar o token no banco de dados
    await db.query(
      'UPDATE password_reset_tokens SET token = $1 WHERE id = $2',
      [tokenRedefinicao, tokenData.id]
    );
    console.log('Token de redefinição atualizado no DB');

    console.log('=== VERIFICAÇÃO CONCLUÍDA COM SUCESSO ===');
    // Retornar sucesso com o token de redefinição
    return res.status(200).json({ 
      message: 'Código verificado com sucesso',
      email: emailNormalizado,
      userId: tokenData.user_id,
      token: tokenRedefinicao
    });

  } catch (error) {
    console.error('=== ERRO NA VERIFICAÇÃO DE CÓDIGO ===');
    console.error('Erro detalhado:', error);
    console.error('Stack trace:', error.stack);
    console.error('Dados que causaram o erro:', { email, codigo });
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

  try {
    const { email, newPassword, token } = req.body;
    
    if (!email || !newPassword || !token) {
      console.log('Dados incompletos:', { 
        email: !!email, 
        newPassword: !!newPassword, 
        token: !!token 
      });
      return res.status(400).json({ message: 'Email, nova senha e token são obrigatórios.' });
    }

    const emailNormalizado = email.trim().toLowerCase();
    
    // 1. Buscar o token no banco de dados e verificar a validade
    console.log('Buscando token para:', emailNormalizado);
    const tokenResult = await db.query(
      'SELECT * FROM password_reset_tokens WHERE email = $1 AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1',
      [emailNormalizado]
    );
    const storedTokenData = tokenResult.rows[0];

    console.log('Resultado da busca do token:', {
      encontrouToken: !!storedTokenData,
      tokenId: storedTokenData?.id,
      tokenExpira: storedTokenData?.expires_at,
      emailEncontrado: storedTokenData?.email
    });

    if (!storedTokenData) {
      return res.status(400).json({ message: 'Token de redefinição inválido ou expirado.' });
    }

    // 2. Comparar o token fornecido com o token armazenado (que já é um hash)
    console.log('Comparando tokens...');
    const isTokenMatch = await bcrypt.compare(token, storedTokenData.token);
    console.log('Resultado da comparação:', isTokenMatch);
    
    if (!isTokenMatch) {
      return res.status(400).json({ message: 'Token de redefinição inválido.' });
    }

    // 3. Buscar o usuário pelo email
    console.log('Buscando usuário:', emailNormalizado);
    const userResult = await db.query('SELECT * FROM usuarios WHERE email = $1', [emailNormalizado]);
    const usuario = userResult.rows[0];

    console.log('Resultado da busca do usuário:', {
      encontrouUsuario: !!usuario,
      userId: usuario?.id,
      email: usuario?.email
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // 4. Hashar a nova senha
    console.log('Gerando hash da nova senha...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Atualizar a senha do usuário
    console.log('Atualizando senha do usuário:', usuario.id);
    await db.query(
      'UPDATE usuarios SET senha = $1 WHERE id = $2',
      [hashedPassword, usuario.id]
    );

    // 6. Invalidar (deletar) o token de redefinição após o uso
    console.log('Removendo token usado...');
    await db.query('DELETE FROM password_reset_tokens WHERE email = $1', [emailNormalizado]);

    // Criar notificação de senha alterada
    console.log('Criando notificação...');
    await NotificacaoService.criarNotificacaoSenhaAlterada(usuario.id, null, false);

    console.log('=== REDEFINIÇÃO DE SENHA CONCLUÍDA COM SUCESSO ===');
    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({
      message: 'Erro no servidor ao redefinir senha.',
      error: error.message
    });
  }
});

// Rotas protegidas (exigem JWT)
router.use(protect);

// Rotas protegidas de Usuário
router.get('/:id', usuariosController.getUsuarioById);
router.put('/:id', upload.fields([
  { name: 'curriculo', maxCount: 1 },
  { name: 'certificados', maxCount: 10 }
]), usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

// Rota para obter perfil completo do usuário autenticado (JWT)
router.get('/perfil', usuariosController.getPerfil);

router.put('/senha/:id', usuariosController.updateSenha);
router.put('/alterar-senha-autenticado/:id', usuariosController.updateSenha);

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

// Rota para verificar se um email existe
router.post('/verificar-email', async (req, res) => {
  const { email } = req.body;
  console.log('=== VERIFICAÇÃO DE EMAIL ===');
  console.log('Email recebido:', email);

  try {
    if (!email) {
      console.log('Email não fornecido');
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    const emailNormalizado = email.trim().toLowerCase();
    
    // Verificar se o email existe no banco de dados
    const queryText = 'SELECT id, email, nome FROM usuarios WHERE email = $1';
    const queryParams = [emailNormalizado];
    console.log('Buscando email:', queryText, queryParams);
    
    const result = await db.query(queryText, queryParams);
    const usuarios = result.rows;

    if (usuarios.length === 0) {
      console.log('Email não encontrado:', emailNormalizado);
      return res.status(404).json({ message: 'Email não cadastrado no sistema' });
    }

    console.log('Email encontrado:', usuarios[0]);
    return res.status(200).json({ 
      message: 'Email encontrado',
      exists: true
    });

  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return res.status(500).json({ 
      message: 'Erro ao verificar email',
      error: error.message
    });
  }
});

// Remover o objeto em memória, pois não é mais usado
// const codigosVerificacao = {};

export default router;