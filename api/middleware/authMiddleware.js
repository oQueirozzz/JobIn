const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  try {
    // Verificar se o token existe no cabeçalho
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Acesso não autorizado, token não fornecido' });
    }
    
    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jobin_secret_key');
    
    // Verificar se o usuário ainda existe no banco de dados
    const usuarioExiste = await Usuario.findById(decoded.id);
    if (!usuarioExiste) {
      return res.status(401).json({ message: 'Usuário não existe mais' });
    }
    
    req.usuario = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acesso não autorizado, token inválido' });
  }
};