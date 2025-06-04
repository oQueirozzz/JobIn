const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController.js');
const db = require('../config/db.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const NotificacaoService = require('../services/notificacaoService.js');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'usuarios');
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
    // Permitir PDFs para currículo e certificados
    else if ((file.fieldname === 'curriculo' || file.fieldname === 'certificados') && file.mimetype === 'application/pdf') {
      cb(null, true);
    }
    else {
      cb(new Error('Tipo de arquivo não permitido'), false);
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
  console.log('Solicitação de código para:', email, 'Código:', codigo);

  try {
    // Verificar se o email existe no banco de dados
    const [usuarios] = await db.query(
      'SELECT id, email, nome FROM usuarios WHERE email = ?', 
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Email não cadastrado no sistema' });
    }

    // Usar o código enviado pelo frontend ou gerar um novo se não for fornecido
    const codigoVerificacao = codigo || Math.floor(100000 + Math.random() * 900000).toString();
    
    // Armazenar o código (em produção, salvar no banco com tempo de expiração)
    codigosVerificacao[email] = {
      codigo: codigoVerificacao,
      expiraEm: Date.now() + 15 * 60 * 1000 // 15 minutos (900 segundos)
    };

    console.log('Código armazenado para', email, ':', codigosVerificacao[email]);

    // Retornar resposta de sucesso
    return res.status(200).json({ 
      message: 'Código de verificação gerado com sucesso',
      success: true
    });

  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return res.status(500).json({ 
      message: 'Erro no servidor',
      error: error.message
    });
  }
});

router.post('/verificar-codigo', async (req, res) => {
  const { email, codigo } = req.body;
  console.log('Verificando código para:', email, 'Código:', codigo);
  
  try {
    const emailNormalizado = email.trim().toLowerCase();
    
    // Verificar se existe um código para este email
    if (!codigosVerificacao[emailNormalizado]) {
      console.log('Nenhum código encontrado para:', emailNormalizado);
      return res.status(400).json({ 
        message: 'Nenhum código solicitado para este email ou código expirado' 
      });
    }
    
    const verificacao = codigosVerificacao[emailNormalizado];
    console.log('Verificação encontrada:', verificacao);
    
    // Verificar se o código expirou
    if (Date.now() > verificacao.expiraEm) {
      console.log('Código expirado:', {
        agora: Date.now(),
        expiraEm: verificacao.expiraEm
      });
      delete codigosVerificacao[emailNormalizado];
      return res.status(400).json({ message: 'Código expirado. Solicite um novo código' });
    }
    
    // Verificar se o código está correto
    if (verificacao.codigo !== codigo) {
      console.log('Código incorreto:', {
        recebido: codigo,
        esperado: verificacao.codigo
      });
      return res.status(400).json({ message: 'Código inválido' });
    }
    
    // Código válido - gerar token temporário para redefinição de senha
    const tokenRedefinicao = Math.random().toString(36).substring(2, 15);
    console.log('Novo token gerado:', tokenRedefinicao);
    
    // Atualizar a verificação com o novo token
    codigosVerificacao[emailNormalizado] = {
      ...verificacao,
      tokenRedefinicao: tokenRedefinicao,
      expiraEm: Date.now() + 15 * 60 * 1000 // 15 minutos
    };
    
    console.log('Verificação atualizada:', codigosVerificacao[emailNormalizado]);
    
    return res.status(200).json({ 
      message: 'Código verificado com sucesso',
      token: tokenRedefinicao
    });
  } catch (error) {
    console.error('Erro na verificação:', error);
    return res.status(500).json({
      message: 'Erro no servidor',
      error: error.message
    });
  }
});

router.put('/redefinir-senha', async (req, res) => {
  console.log('=== ENDPOINT REDEFINIR SENHA CHAMADO ===');
  console.log('URL completa:', req.originalUrl);
  console.log('Método:', req.method);
  console.log('Body completo:', req.body);
  
  const { email, token, novaSenha } = req.body;
  console.log('Dados recebidos para redefinição:', { email, token });

  try {
    // Verificar se o email e token existem
    if (!email || !token || !novaSenha) {
      console.log('Dados faltando:', { email: !!email, token: !!token, novaSenha: !!novaSenha });
      return res.status(400).json({ 
        message: 'Email, token e nova senha são obrigatórios' 
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    console.log('Email normalizado:', emailNormalizado);

    // Verificar token de redefinição
    if (!codigosVerificacao[emailNormalizado]) {
      console.log('Códigos de verificação:', codigosVerificacao);
      console.log('Email não encontrado nos códigos:', emailNormalizado);
      return res.status(400).json({ 
        message: 'Nenhuma solicitação de redefinição encontrada para este email' 
      });
    }

    const verificacao = codigosVerificacao[emailNormalizado];
    console.log('Verificação encontrada:', verificacao);
    
    if (!verificacao.tokenRedefinicao) {
      console.log('Token de redefinição não encontrado na verificação');
      return res.status(400).json({ 
        message: 'Token de redefinição inválido' 
      });
    }

    if (verificacao.tokenRedefinicao !== token) {
      console.log('Token não corresponde:', { 
        recebido: token, 
        esperado: verificacao.tokenRedefinicao 
      });
      return res.status(400).json({ 
        message: 'Token inválido' 
      });
    }

    // Verificar se o token expirou (15 minutos)
    if (Date.now() > verificacao.expiraEm) {
      console.log('Token expirado:', { 
        agora: Date.now(), 
        expiraEm: verificacao.expiraEm 
      });
      delete codigosVerificacao[emailNormalizado];
      return res.status(400).json({ 
        message: 'Token expirado. Solicite um novo código' 
      });
    }

    // Verificar se o usuário existe
    const [usuario] = await db.query('SELECT id FROM usuarios WHERE email = ?', [emailNormalizado]);
    if (!usuario || usuario.length === 0) {
      return res.status(404).json({ 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Hash da nova senha
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    // Atualizar senha no banco usando o email
    const [result] = await db.query(
      'UPDATE usuarios SET senha = ? WHERE email = ?',
      [senhaHash, emailNormalizado]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Erro ao atualizar senha' 
      });
    }
    
    // Limpar código de verificação após uso
    delete codigosVerificacao[emailNormalizado];

    // Criar notificação de senha alterada usando o email
    const [usuarioNotificacao] = await db.query('SELECT id FROM usuarios WHERE email = ?', [emailNormalizado]);
    if (usuarioNotificacao && usuarioNotificacao.length > 0) {
      await NotificacaoService.criarNotificacaoSenhaAlterada(usuarioNotificacao[0].id, 0, false);
    }

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

// Rotas de perfil
router.get('/perfil', usuariosController.getPerfil);
router.put('/atualizar', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'curriculo', maxCount: 1 },
  { name: 'certificados', maxCount: 1 }
]), usuariosController.updateUsuario);

// Rotas com ID (devem vir por último)
router.get('/:id', usuariosController.getUsuarioById);
router.put('/:id', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'curriculo', maxCount: 1 },
  { name: 'certificados', maxCount: 1 }
]), usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

// Inicializar o Resend para envio de emails


// Armazenar códigos de verificação temporariamente (em produção, usar banco de dados)
const codigosVerificacao = {};

module.exports = router;