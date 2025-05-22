const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const db = require('../config/db');
const { Resend } = require('resend');

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
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

// Inicializar o Resend para envio de emails
const resend = new Resend(process.env.RESEND_API_KEY);

// Armazenar códigos de verificação temporariamente (em produção, usar banco de dados)
const codigosVerificacao = {};

// Rota para solicitar código de verificação
router.post('/solicitar-codigo', async (req, res) => {
  const { email } = req.body;
  console.log('Solicitação de código para:', email);

  try {
    // Verificar se o email existe no banco de dados
    const [usuarios] = await db.query(
      'SELECT id, email, nome FROM usuarios WHERE email = ?', 
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Email não cadastrado no sistema' });
    }

    // Gerar código de verificação (6 dígitos)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Armazenar o código (em produção, salvar no banco com tempo de expiração)
    codigosVerificacao[email] = {
      codigo,
      expiraEm: Date.now() + 15 * 60 * 1000 // 15 minutos
    };

    // Enviar email com o código
    try {
      await resend.emails.send({
        from: 'JobIn <noreply@jobin.com.br>',
        to: email,
        subject: 'Código de Verificação - JobIn',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6cf7;">JobIn - Recuperação de Senha</h2>
            <p>Olá ${usuarios[0].nome || 'usuário'},</p>
            <p>Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para continuar:</p>
            <div style="background-color: #f4f7ff; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${codigo}
            </div>
            <p>Este código expira em 15 minutos.</p>
            <p>Se você não solicitou esta alteração, ignore este email.</p>
            <p>Atenciosamente,<br>Equipe JobIn</p>
          </div>
        `
      });
      
      return res.status(200).json({ 
        message: 'Código de verificação enviado com sucesso para o email' 
      });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      return res.status(500).json({ 
        message: 'Erro ao enviar email de verificação',
        error: emailError.message
      });
    }
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