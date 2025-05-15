const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const usuariosController = require('../controllers/usuariosController');
const { protect } = require('../middleware/authMiddleware');

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Acesso não autorizado, token não fornecido' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jobin_secret_key');
    req.usuario = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acesso não autorizado, token inválido' });
  }
};

// Rotas públicas
router.post('/register', usuariosController.registerUsuario);
router.post('/login', usuariosController.loginUsuario);

// Rotas protegidas
router.get('/', authMiddleware, usuariosController.getUsuarios);
router.get('/:id', authMiddleware, usuariosController.getUsuarioById);
router.put('/:id', authMiddleware, usuariosController.updateUsuario);
router.delete('/:id', authMiddleware, usuariosController.deleteUsuario);

module.exports = router;