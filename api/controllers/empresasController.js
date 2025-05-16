const Empresa = require('../models/Empresa');
const jwt = require('jsonwebtoken');

// Configuração do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'jobin_secret_key';

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Obter todas as empresas
exports.getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ message: 'Erro ao buscar empresas' });
  }
};

// Obter uma empresa pelo ID
exports.getEmpresaById = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar empresa' });
  }
};

// Registrar uma nova empresa
exports.registerEmpresa = async (req, res) => {
  try {
    const { nome, email, senha, cnpj } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha || !cnpj) {
      return res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios' });
    }

    // Verificar se a empresa já existe
    const empresaExistente = await Empresa.findByEmail(email);
    if (empresaExistente) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }

    // Criar a empresa
    const novaEmpresa = await Empresa.create(req.body);

    // Gerar token JWT
    const token = generateToken(novaEmpresa.id);

    res.status(201).json({
      id: novaEmpresa.id,
      nome: novaEmpresa.nome,
      email: novaEmpresa.email,
      token
    });
  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    res.status(500).json({ message: 'Erro ao registrar empresa' });
  }
};

// Login de empresa
exports.loginEmpresa = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    // Buscar empresa pelo email
    const empresa = await Empresa.findByEmail(email);
    if (!empresa) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const senhaCorreta = await Empresa.comparePassword(senha, empresa.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token JWT
    const token = generateToken(empresa.id);

    res.status(200).json({
      id: empresa.id,
      nome: empresa.nome,
      email: empresa.email,
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Atualizar uma empresa
exports.updateEmpresa = async (req, res) => {
  try {
    const result = await Empresa.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ message: 'Erro ao atualizar empresa' });
  }
};

// Excluir uma empresa
exports.deleteEmpresa = async (req, res) => {
  try {
    const result = await Empresa.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json({ message: 'Empresa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    res.status(500).json({ message: 'Erro ao excluir empresa' });
  }
};