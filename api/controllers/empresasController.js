const Empresa = require('../models/Empresa');
const jwt = require('jsonwebtoken');
const logsController = require('./logsController');

// Configuração simplificada sem JWT
// Removida a geração de token para simplificar a API

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
    
    // Registrar log de criação de empresa
    await logsController.registrarLog(
      0, // Sem usuário associado
      novaEmpresa.id,
      'CRIAR',
      'EMPRESA',
      `Nova empresa registrada: ${nome}`,
      { empresa_id: novaEmpresa.id }
    );
    
    // Criar notificação para a empresa
    const Notificacao = require('../models/Notificacao');
    await Notificacao.create({
      candidaturas_id: 0, // Sem candidatura associada
      empresas_id: novaEmpresa.id,
      usuarios_id: 0, // Sem usuário específico
      mensagem_empresa: `Bem-vindo ao JobIn! Sua conta foi criada com sucesso.`,
      mensagem_usuario: null
    });

    // Versão simplificada sem token
    res.status(201).json({
      id: novaEmpresa.id,
      nome: novaEmpresa.nome,
      email: novaEmpresa.email,
      autenticado: true
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
    
    // Registrar log de login
    await logsController.logLogin(0, empresa.id, 'empresa');

    // Versão simplificada sem token
    res.status(200).json({
      id: empresa.id,
      nome: empresa.nome,
      email: empresa.email,
      autenticado: true
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
    
    // Registrar log de atualização de perfil
    await logsController.logAtualizacaoPerfil(0, req.params.id, 'empresa');
    
    res.status(200).json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ message: 'Erro ao atualizar empresa' });
  }
};

// Excluir uma empresa
exports.deleteEmpresa = async (req, res) => {
  try {
    // Registrar log antes de excluir a empresa
    await logsController.registrarLog(
      0,
      req.params.id,
      'EXCLUIR',
      'EMPRESA',
      `Empresa excluída: ID ${req.params.id}`,
      { empresa_id: req.params.id }
    );
    
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