const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Rotas protegidas
router.get('/', protect, logsController.getLogs);
router.get('/:id', protect, logsController.getLogById);
router.get('/usuario/:usuarioId', protect, logsController.getLogsByUsuario);
router.get('/empresa/:empresaId', protect, logsController.getLogsByEmpresa);
router.get('/acao/:acao', protect, logsController.getLogsByAcao);
router.post('/', protect, logsController.createLog);
router.put('/:id', protect, logsController.updateLog);
router.delete('/:id', protect, logsController.deleteLog);

module.exports = router;