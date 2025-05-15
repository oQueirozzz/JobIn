const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const empresasController = require('../controllers/empresasController');
const { protect } = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/register', empresasController.registerEmpresa);
router.post('/login', empresasController.loginEmpresa);
router.get('/', empresasController.getEmpresas);
router.get('/:id', empresasController.getEmpresaById);

// Rotas protegidas
router.put('/:id', protect, empresasController.updateEmpresa);
router.delete('/:id', protect, empresasController.deleteEmpresa);

module.exports = router;