const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
// Importando o middleware modificado que agora permite acesso sem token
const { protect } = require('../middleware/authMiddleware');

// Middleware de autenticação simplificado - permite acesso sem token
const authMiddleware = (req, res, next) => {
  // Bypass de autenticação
  next();
};


// Rotas públicas
router.post('/register', usuariosController.registerUsuario);
router.post('/login', usuariosController.loginUsuario);
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);

// Rotas de perfil (sem proteção)
router.get('/perfil', usuariosController.getPerfil);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;