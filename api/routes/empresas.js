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

// Todas as rotas são públicas
router.put('/:id', empresasController.updateEmpresa);
router.delete('/:id', empresasController.deleteEmpresa);

module.exports = router;