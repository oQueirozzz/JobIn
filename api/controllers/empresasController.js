import Empresa from '../models/Empresa.js';
import * as logsController from './logsController.js';
import Log from '../models/Log.js';
import Notificacao from '../models/Notificacao.js';
import NotificacaoService from '../services/notificacaoService.js';
import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Obter todas as empresas
export const getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ message: 'Erro ao buscar empresas', error: error.message });
  }
};

// Obter uma empresa pelo ID
export const getEmpresaById = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.status(200).json({
      id: empresa.id,
      nome: empresa.nome,
      email: empresa.email,
      cnpj: empresa.cnpj,
      descricao: empresa.descricao,
      local: empresa.local,
      tipo: empresa.tipo
    });
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ message: 'Erro ao buscar empresa', error: error.message });
  }
};

// Registrar uma nova empresa
export const registerEmpresa = async (req, res) => {
  try {
    const { nome, email, senha, cnpj, local, descricao } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !senha || !cnpj) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o email já está em uso
    const empresaExistente = await Empresa.findByEmail(email);
    if (empresaExistente) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Verificar se o CNPJ já está em uso
    const cnpjExistente = await Empresa.findByCNPJ(cnpj);
    if (cnpjExistente) {
      return res.status(400).json({ message: 'CNPJ já está em uso' });
    }

    // Criar a empresa
    const empresa = await Empresa.create({
      nome,
      email,
      senha,
      cnpj,
      local,
      descricao,
      tipo: 'empresa'
    });

    // Criar notificação de conta criada
    await NotificacaoService.criarNotificacaoContaCriada(0, empresa.id, true);

    // Registrar log sem usuário (usando 0 como ID do sistema)
    await logsController.registrarLog(
      0, // ID do sistema
      empresa.id,
      'CRIAR',
      'EMPRESA',
      `Empresa "${nome}" criada`,
      { empresa_id: empresa.id }
    );

    // Montar objeto de empresa para o frontend
    const empresaFrontend = {
      id: empresa.id,
      nome: empresa.nome,
      email: empresa.email,
      cnpj: empresa.cnpj,
      descricao: empresa.descricao || '',
      local: empresa.local || '',
      tipo: 'empresa',
      autenticado: true
    };

    // Gerar token JWT
    const token = jwt.sign(
      { id: empresa.id, type: 'company' },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      { expiresIn: '24h' }
    );

    // Retornar token e objeto empresa
    res.status(201).json({
      token,
      empresa: empresaFrontend
    });
  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    res.status(500).json({ message: 'Erro ao registrar empresa', error: error.message });
  }
};

// Login de empresa
export const loginEmpresa = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({
        message: 'Por favor, preencha todos os campos para fazer login.'
      });
    }

    // Verificar se o email pertence a um usuário
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
      local: empresa.local || '',
      tipo: 'empresa',
      autenticado: true
    };

    // Gerar token JWT
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
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

// Atualizar uma empresa
export const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresaData = req.body;

    // Verificar se a empresa existe
    const empresa = await Empresa.findById(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Atualizar a empresa
    const empresaAtualizada = await Empresa.update(id, empresaData);

    res.status(200).json({
      id: empresaAtualizada.id,
      nome: empresaAtualizada.nome,
      email: empresaAtualizada.email,
      cnpj: empresaAtualizada.cnpj,
      descricao: empresaAtualizada.descricao,
      local: empresaAtualizada.local,
      tipo: empresaAtualizada.tipo
    });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ message: 'Erro ao atualizar empresa', error: error.message });
  }
};

// Excluir uma empresa
export const deleteEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await Notificacao.deleteByEmpresaId(id);

    const deletedEmpresa = await Empresa.delete(id);

    if (!deletedEmpresa) {
      return res.status(400).json({ error: 'Erro ao excluir empresa' });
    }

    res.json({ message: 'Empresa excluída com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir empresa:', error);
    res.status(500).json({ error: 'Erro ao excluir empresa', error: error.message });
  }
};