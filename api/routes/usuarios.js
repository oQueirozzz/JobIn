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
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);

// Rotas protegidas
router.get('/perfil', protect, usuariosController.getPerfil);
router.put('/:id', protect, usuariosController.updateUsuario);
router.delete('/:id', protect, usuariosController.deleteUsuario);

module.exports = router;