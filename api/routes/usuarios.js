const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const db = require('../config/db');
const { Resend } = require('resend');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
router.get('/:id', usuariosController.getUsuarioById);

// Rotas de perfil
router.get('/perfil', usuariosController.getPerfil);
router.put('/atualizar', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'curriculo', maxCount: 1 },
  { name: 'certificados', maxCount: 1 }
]), usuariosController.updateUsuario); // Nova rota para atualização de perfil com upload
router.put('/:id', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'curriculo', maxCount: 1 },
  { name: 'certificados', maxCount: 1 }
]), usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

// Inicializar o Resend para envio de emails


// Armazenar códigos de verificação temporariamente (em produção, usar banco de dados)
const codigosVerificacao = {};

// Rota para solicitar código de verificação
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

// Rota para verificar código
router.post('/verificar-codigo', (req, res) => {
  const { email, codigo } = req.body;
  
  // Verificar se existe um código para este email
  if (!codigosVerificacao[email]) {
    return res.status(400).json({ 
      message: 'Nenhum código solicitado para este email ou código expirado' 
    });
  }
  
  const verificacao = codigosVerificacao[email];
  
  // Verificar se o código expirou
  if (Date.now() > verificacao.expiraEm) {
    delete codigosVerificacao[email];
    return res.status(400).json({ message: 'Código expirado. Solicite um novo código' });
  }
  
  // Verificar se o código está correto
  if (verificacao.codigo !== codigo) {
    return res.status(400).json({ message: 'Código inválido' });
  }
  
  // Código válido - gerar token temporário para redefinição de senha
  const tokenRedefinicao = Math.random().toString(36).substring(2, 15);
  verificacao.tokenRedefinicao = tokenRedefinicao;
  
  return res.status(200).json({ 
    message: 'Código verificado com sucesso',
    token: tokenRedefinicao
  });
});

// Rota para redefinir senha
router.put('/redefinir-senha', async (req, res) => {
  const { email, token, novaSenha } = req.body;
  console.log('Dados recebidos para redefinição:', { email });

  try {
    // Verificar token de redefinição
    if (!codigosVerificacao[email] || codigosVerificacao[email].tokenRedefinicao !== token) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }
    
    // Buscar usuário
    const [usuarios] = await db.query(
      'SELECT id, email FROM usuarios WHERE email = ?', 
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const userId = usuarios[0].id;
    
    // Hash da nova senha
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    // Atualizar senha no banco
    const [result] = await db.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [senhaHash, userId]  
    );
    
    // Limpar código de verificação após uso
    delete codigosVerificacao[email];

    return res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro completo:', error);
    return res.status(500).json({ 
      message: 'Erro no servidor',
      errorDetails: error.message
    });
  }
});

module.exports = router;