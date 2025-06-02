const Empresa = require('../models/Empresa');
const logsController = require('./logsController');
const Log = require('../models/Log');
const Notificacao = require('../models/Notificacao');

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
    console.log('Recebendo requisição de registro de empresa:', {
      ...req.body,
      senha: '[REDACTED]'
    });

    const { nome, email, senha, cnpj, descricao, local, tipo } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !senha || !cnpj) {
      console.error('Campos obrigatórios faltando:', {
        nome: !nome,
        email: !email,
        senha: !senha,
        cnpj: !cnpj
      });
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Email inválido:', email);
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar formato do CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      console.error('CNPJ inválido:', cnpj);
      return res.status(400).json({ error: 'CNPJ deve conter 14 dígitos' });
    }

    // Verificar se já existe uma empresa com o mesmo email
    const empresaExistente = await Empresa.findByEmail(email.toLowerCase());
    if (empresaExistente) {
      console.error('Email já cadastrado:', email);
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criar nova empresa
    console.log('Criando nova empresa...');
    const novaEmpresa = await Empresa.create({
      nome,
      email: email.toLowerCase(),
      senha,
      cnpj: cnpjLimpo,
      descricao: descricao || '',
      local: local || '',
      tipo: tipo || 'empresa'
    });

    console.log('Empresa criada com sucesso:', {
      id: novaEmpresa.id,
      nome: novaEmpresa.nome,
      email: novaEmpresa.email
    });

    // Registrar ação no log
    await Log.create({
      usuario_id: 0,
      empresa_id: novaEmpresa.id,
      acao: 'REGISTER',
      resourse: 'empresas',
      descricao: 'Registro de nova empresa',
      detalhes: {
        nome: novaEmpresa.nome,
        email: novaEmpresa.email,
        cnpj: novaEmpresa.cnpj
      }
    });

    // Retornar dados da empresa (exceto senha)
    const { senha: _, ...empresaSemSenha } = novaEmpresa;
    res.status(201).json(empresaSemSenha);
  } catch (error) {
    console.error('Erro ao registrar empresa:', {
      message: error.message,
      stack: error.stack,
      body: {
        ...req.body,
        senha: '[REDACTED]'
      }
    });
    res.status(500).json({ 
      error: 'Erro ao registrar empresa',
      details: error.message 
    });
  }
};

// Login de empresa
exports.loginEmpresa = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ 
        message: 'Por favor, preencha todos os campos para fazer login.' 
      });
    }

    // Verificar se o email pertence a um usuário
    const Usuario = require('../models/Usuario');
    const usuarioComMesmoEmail = await Usuario.findByEmail(email);
    if (usuarioComMesmoEmail) {
      return res.status(401).json({ 
        message: 'Ops! Parece que você está tentando fazer login como empresa, mas este email está cadastrado como candidato. Por favor, clique em "Sou Candidato" e tente novamente.' 
      });
    }

    // Buscar empresa pelo email
    const empresa = await Empresa.findByEmail(email);
    if (!empresa) {
      return res.status(401).json({ 
        message: 'Não encontramos uma empresa com este email. Verifique se o email está correto ou cadastre sua empresa.' 
      });
    }

    // Verificar senha
    const senhaCorreta = await Empresa.comparePassword(senha, empresa.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ 
        message: 'Senha incorreta. Por favor, verifique sua senha e tente novamente.' 
      });
    }
    
    // Registrar log de login
    await logsController.logLogin(0, empresa.id, 'empresa');

    // Montar objeto de empresa para o frontend
    const empresaFrontend = {
      id: empresa.id,
      nome: empresa.nome,
      email: empresa.email,
      cnpj: empresa.cnpj,
      descricao: empresa.descricao || '',
      logo: empresa.logo || '',
      tipo: 'empresa',
      autenticado: true
    };

    // Gerar token JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: empresa.id, type: 'company' },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      { expiresIn: '24h' }
    );

    // Retornar token e objeto empresa
    res.status(200).json({
      token,
      empresa: empresaFrontend
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Atualizar uma empresa
exports.updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const result = await Empresa.update(id, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Nenhum campo foi atualizado' });
    }

    // Registrar ação no log
    await Log.create({
      usuario_id: 0,
      empresa_id: id,
      acao: 'UPDATE',
      tabela: 'empresas',
      registro_id: id,
      detalhes: req.body
    });

    res.json({ message: 'Empresa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
};

// Excluir uma empresa
exports.deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    const result = await Empresa.delete(id);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Erro ao excluir empresa' });
    }

    // Registrar ação no log
    await Log.create({
      usuario_id: 0,
      empresa_id: id,
      acao: 'DELETE',
      tabela: 'empresas',
      registro_id: id,
      detalhes: {
        nome: empresa.nome,
        email: empresa.email
      }
    });

    res.json({ message: 'Empresa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    res.status(500).json({ error: 'Erro ao excluir empresa' });
  }
};