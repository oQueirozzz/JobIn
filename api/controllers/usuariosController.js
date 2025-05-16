const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Configuração do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'jobin_secret_key';

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
};

// Obter todos os usuários
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

// Obter um usuário pelo ID
exports.getUsuarioById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Buscando usuário com ID:', id);
    
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    console.log('Usuário encontrado:', usuario);
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
};

// Registrar um novo usuário
exports.registerUsuario = async (req, res) => {
  try {
    const { nome, email, senha, cpf, data_nascimento } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha || !cpf || !data_nascimento ) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }

    // Criar o usuário
    const novoUsuario = await Usuario.create(req.body);

    // Gerar token JWT
    const token = generateToken(novoUsuario.id);

    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    // Buscar usuário pelo email
    const usuario = await Usuario.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const senhaCorreta = await Usuario.comparePassword(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token JWT
    const token = generateToken(usuario.id);

    res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Atualizar um usuário
exports.updateUsuario = async (req, res) => {
  try {
    const result = await Usuario.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// Excluir um usuário
exports.deleteUsuario = async (req, res) => {
  try {
    const result = await Usuario.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
};

// Obter perfil do usuário autenticado
exports.getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
  }
};