import Empresa from '../models/Empresa.js';
import * as logsController from './logsController.js';
import Log from '../models/Log.js';
import Notificacao from '../models/Notificacao.js';
import NotificacaoService from '../services/notificacaoService.js';
import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração simplificada sem JWT
// Removida a geração de token para simplificar a API

// Obter todas as empresas
export const getEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ message: 'Erro ao buscar empresas' });
  }
};

// Obter uma empresa pelo ID
export const getEmpresaById = async (req, res) => {
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
      logo: empresa.logo ? `/uploads/usuarios/${path.basename(empresa.logo)}` : '',
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
    res.status(500).json({ message: 'Erro ao registrar empresa' });
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
      logo: empresa.logo ? `/uploads/usuarios/${path.basename(empresa.logo)}` : '',
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
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Atualizar uma empresa
export const updateEmpresa = async (req, res) => {
  try {
    console.log('Recebendo requisição de atualização:', {
      params: req.params,
      body: req.body,
      file: req.file
    });

    const { id } = req.params;
    const empresaId = parseInt(id);

    if (isNaN(empresaId)) {
      return res.status(400).json({ message: 'ID da empresa inválido' });
    }

    // Verificar se a empresa existe
    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Se houver um arquivo de imagem, processá-lo
    if (req.file) {
      console.log('Arquivo recebido:', req.file);
      // Remover a logo antiga se existir
      if (empresa.logo) {
        const oldLogoPath = path.join(__dirname, '..', empresa.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      // Atualizar o caminho da logo no corpo da requisição
      req.body.logo = `/uploads/empresas/${req.file.filename}`;
      console.log('Novo caminho da logo:', req.body.logo);
    }

    // Preparar dados para atualização
    const updateData = {
      nome: req.body.nome,
      cnpj: req.body.cnpj,
      email: req.body.email,
      telefone: req.body.telefone,
      descricao: req.body.descricao,
      site: req.body.site,
      local: req.body.local,
      logo: req.body.logo
    };

    // Se houver uma nova senha, atualizá-la
    if (req.body.senha) {
      updateData.senha = await bcrypt.hash(req.body.senha, 10);
    }

    console.log('Dados para atualização:', updateData);

    // Atualizar a empresa
    const empresaAtualizada = await Empresa.update(empresaId, updateData);
    console.log('Empresa atualizada:', empresaAtualizada);

    // Criar log da atualização
    await Log.create({
      usuario_id: null, // Ação realizada por uma empresa, não um usuário
      empresa_id: req.usuario.id, // ID da empresa que realizou a atualização
      tipo_acao: 'UPDATE',
      tipo_entidade: 'EMPRESA',
      entidade_id: empresaId,
      detalhes: JSON.stringify({
        campos_atualizados: Object.keys(updateData),
        empresa_id: empresaId
      })
    });

    // Criar notificação de perfil atualizado para a empresa
    await NotificacaoService.criarNotificacaoPerfilAtualizado(null, empresaId, true);

    // Preparar resposta
    const empresaFrontend = {
      id: empresaAtualizada.id,
      nome: empresaAtualizada.nome,
      cnpj: empresaAtualizada.cnpj,
      email: empresaAtualizada.email,
      telefone: empresaAtualizada.telefone,
      descricao: empresaAtualizada.descricao,
      site: empresaAtualizada.site,
      local: empresaAtualizada.local,
      logo: empresaAtualizada.logo
    };

    console.log('Enviando resposta:', { empresa: empresaFrontend });
    res.json({ empresa: empresaFrontend });
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
    res.status(500).json({ error: 'Erro ao excluir empresa' });
  }
};