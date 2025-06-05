import Usuario from '../models/Usuario.js';
import * as logsController from './logsController.js';
import NotificacaoService from '../services/notificacaoService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Empresa from '../models/Empresa.js';

// Configuração simplificada sem JWT
// Removida a geração de token para simplificar a API

// Obter todos os usuários
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

// Obter um usuário pelo ID
export const getUsuarioById = async (req, res) => {
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

// Registrar usuário
export const registerUsuario = async (req, res) => {
  try {
    console.log('=== INÍCIO DO REGISTRO DE USUÁRIO ===');
    console.log('Body recebido:', req.body);
    
    const { nome, email, senha, cpf, descricao } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !senha || !cpf) {
      console.log('Campos obrigatórios faltando:', { nome: !!nome, email: !!email, senha: !!senha, cpf: !!cpf });
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validar formato do CPF (apenas números)
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf.replace(/\D/g, ''))) {
      return res.status(400).json({ message: 'CPF inválido. Deve conter 11 dígitos numéricos' });
    }

    // Verificar se o email já está em uso
    console.log('Verificando email existente:', email);
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      console.log('Email já em uso:', email);
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Verificar se o CPF já está em uso
    console.log('Verificando CPF existente:', cpf);
    const cpfExistente = await Usuario.findByCPF(cpf);
    if (cpfExistente) {
      console.log('CPF já em uso:', cpf);
      return res.status(400).json({ message: 'CPF já está em uso' });
    }

    // Criar o usuário
    console.log('Criando usuário com dados:', { nome, email, cpf, descricao });
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      cpf,
      descricao,
      tipo: 'usuario'
    });

    if (!usuario) {
      throw new Error('Falha ao criar usuário');
    }

    console.log('Usuário criado com sucesso:', usuario);

    // Criar notificação de conta criada
    console.log('Criando notificação de boas-vindas...');
    await NotificacaoService.criarNotificacaoContaCriada(usuario.id, 0, false);
    console.log('Notificação de boas-vindas criada com sucesso');

    // Registrar log sem empresa (usando 0 como ID do sistema)
    console.log('Registrando log de criação...');
    await logsController.registrarLog(
      usuario.id,
      0, // ID do sistema
      'CRIAR',
      'USUARIO',
      `Usuário "${nome}" criado`,
      { usuario_id: usuario.id }
    );
    console.log('Log registrado com sucesso');

    console.log('=== REGISTRO CONCLUÍDO COM SUCESSO ===');
    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      descricao: usuario.descricao,
      tipo: usuario.tipo,
      curriculo: usuario.curriculo || null
    });
  } catch (error) {
    console.error('=== ERRO NO REGISTRO DE USUÁRIO ===');
    console.error('Erro detalhado:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Erro ao registrar usuário',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login de usuário
export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    console.log('=== INÍCIO DO LOGIN ===');
    console.log('Email recebido:', email);

    if (!email || !senha) {
      console.log('Campos faltando:', { email: !!email, senha: !!senha });
      return res.status(400).json({ 
        message: 'Por favor, preencha todos os campos para fazer login.' 
      });
    }

    // Verificar se o email pertence a uma empresa
    const empresaComMesmoEmail = await Empresa.findByEmail(email);
    if (empresaComMesmoEmail) {
      console.log('Email pertence a uma empresa:', email);
      return res.status(401).json({ 
        message: 'Ops! Parece que você está tentando fazer login como candidato, mas este email está cadastrado como empresa. Por favor, clique em "Sou Empresa" e tente novamente.' 
      });
    }

    console.log('Buscando usuário com email:', email);
    const usuario = await Usuario.findByEmail(email);
    
    if (!usuario) {
      console.log('Usuário não encontrado:', email);
      return res.status(401).json({ 
        message: 'Não encontramos uma conta com este email. Verifique se o email está correto ou cadastre-se como candidato.' 
      });
    }

    console.log('Usuário encontrado:', {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });

    console.log('Verificando senha...');
    const senhaCorreta = await Usuario.comparePassword(senha, usuario.senha);
    console.log('Senha correta?', senhaCorreta);

    if (!senhaCorreta) {
      console.log('Senha incorreta para o usuário:', email);
      return res.status(401).json({ 
        message: 'Senha incorreta. Por favor, verifique sua senha e tente novamente.' 
      });
    }
    
    // Registrar log de login
    try {
      await logsController.logLogin(usuario.id, 0, 'usuario');
    } catch (error) {
      console.error('Erro ao registrar log de login:', error);
      // Não interrompe o fluxo, apenas loga o erro
    }

    // Montar objeto de usuário para o frontend
    const usuarioFrontend = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || '',
      formacao: usuario.formacao || '',
      area_interesse: usuario.area_interesse || '',
      habilidades: usuario.habilidades || '',
      descricao: usuario.descricao || '',
      curriculo: usuario.curriculo || '',
      foto: usuario.foto || usuario.foto_perfil || '',
      tipo: 'usuario',
      autenticado: true
    };

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, type: 'user' },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      { expiresIn: '24h' }
    );

    console.log('=== LOGIN CONCLUÍDO COM SUCESSO ===');
    res.status(200).json({
      token,
      usuario: usuarioFrontend
    });
  } catch (error) {
    console.error('=== ERRO NO LOGIN ===');
    console.error('Erro detalhado:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Erro ao fazer login',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Atualizar um usuário
export const updateUsuario = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    console.log('ID do usuário recebido:', usuarioId);
    console.log('Tipo do ID:', typeof usuarioId);

    // Verificar se o usuário existe
    const usuarioExistente = await Usuario.findById(usuarioId);
    console.log('Usuário existente:', usuarioExistente);

    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log('Iniciando atualização do usuário...');
    console.log('Iniciando atualização no modelo com ID:', usuarioId);

    // Preparar dados para atualização
    const dadosAtualizacao = {
      ...req.body,
      id: usuarioId
    };

    // Se houver arquivos, processar o upload
    if (req.files) {
      console.log('Arquivos recebidos:', req.files);
      
      if (req.files.foto) {
        const foto = req.files.foto[0];
        // Salvar apenas o nome do arquivo, não o caminho completo
        dadosAtualizacao.foto = `uploads/usuarios/${foto.filename}`;
      }
      
      if (req.files.curriculo) {
        const curriculo = req.files.curriculo[0];
        dadosAtualizacao.curriculo = `uploads/usuarios/${curriculo.filename}`;
      }
      
      if (req.files.certificados) {
        const certificados = req.files.certificados.map(file => `uploads/usuarios/${file.filename}`);
        dadosAtualizacao.certificados = certificados;
      }
    }

    console.log('Dados recebidos para atualização:', dadosAtualizacao);

    // Atualizar usuário
    const usuarioAtualizado = await Usuario.update(usuarioId, dadosAtualizacao);
    console.log('Resultado da atualização:', usuarioAtualizado);

    // Buscar dados atualizados
    console.log('Buscando dados atualizados do usuário...');
    const dadosAtualizados = await Usuario.findById(usuarioId);
    console.log('Dados atualizados encontrados:', dadosAtualizados);

    // Registrar log da atualização
    await logsController.logAtualizacaoPerfil(usuarioId, 0, false);

    // Criar notificação de perfil atualizado
    await NotificacaoService.criarNotificacaoPerfilAtualizado(usuarioId, 0, false);

    res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      usuario: dadosAtualizados
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};

// Excluir um usuário
export const deleteUsuario = async (req, res) => {
  try {
    // Registrar log antes de excluir o usuário
    await logsController.registrarLog(
      req.params.id,
      0,
      'EXCLUIR',
      'USUARIO',
      `Usuário excluído: ID ${req.params.id}`,
      { usuario_id: req.params.id }
    );
    
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

// Obter perfil do usuário (modificado para funcionar sem autenticação)
export const getPerfil = async (req, res) => {
  try {
    // Verifica se há um ID na query ou usa um ID padrão para testes
    const userId = req.query.id || req.params.id || '1'; // ID padrão para testes
    
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(200).json({ message: 'Usuário de teste', nome: 'Usuário Teste', email: 'teste@exemplo.com' });
    }
    
    // Remove a senha antes de enviar a resposta
    const { senha, ...usuarioSemSenha } = usuario;
    
    res.status(200).json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    // Retorna um usuário fictício para testes em caso de erro
    res.status(200).json({ message: 'Usuário de teste', nome: 'Usuário Teste', email: 'teste@exemplo.com' });
  }
};

export const updateSenha = async (req, res) => {
  try {
    const { id } = req.params;
    const { senha_atual, nova_senha } = req.body;

    // Buscar o usuário
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha atual
    const senhaCorreta = await bcrypt.compare(senha_atual, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ message: 'Senha atual incorreta' });
    }

    // Criptografar nova senha
    const senhaCriptografada = await bcrypt.hash(nova_senha, 10);

    // Atualizar senha
    const resultado = await Usuario.update(id, { senha: senhaCriptografada });
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Criar notificação
    await NotificacaoService.criarNotificacaoSenhaAlterada(id);

    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
};

