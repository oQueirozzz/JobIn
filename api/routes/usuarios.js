const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const db = require('../config/db');

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

router.put('/redefinir-senha', async (req, res) => {
  const { email, novaSenha } = req.body;
  console.log('Dados recebidos:', { email, novaSenha });

  try {
    const [usuarios] = await db.query(
      'SELECT id, email FROM usuarios WHERE email = ?', 
      [email]
    );
    console.log('Resultado da consulta:', usuarios);

    if (usuarios.length === 0) {
      console.log('Email não encontrado');
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const userId = usuarios[0].id;
    console.log('ID encontrado:', userId);

    const [result] = await db.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [novaSenha, userId]  
    );
    console.log('Resultado do UPDATE:', result);

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