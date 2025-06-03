const Usuario = require('../models/Usuario');
const logsController = require('./logsController');
const NotificacaoService = require('../services/notificacaoService');
const bcrypt = require('bcrypt');

// Configuração simplificada sem JWT
// Removida a geração de token para simplificar a API

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

// Registrar usuário
exports.registerUsuario = async (req, res) => {
  try {
    const { nome, email, senha, cpf, local, descricao } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !senha || !cpf) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o email já está em uso
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Verificar se o CPF já está em uso
    const cpfExistente = await Usuario.findByCPF(cpf);
    if (cpfExistente) {
      return res.status(400).json({ message: 'CPF já está em uso' });
    }

    // Criar o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      cpf,
      local,
      descricao,
      tipo: 'usuario'
    });

    // Criar notificação de conta criada
    await NotificacaoService.criarNotificacaoContaCriada(usuario.id, 0, false);

    // Registrar log sem empresa (usando 0 como ID do sistema)
    await logsController.registrarLog(
      usuario.id,
      0, // ID do sistema
      'CRIAR',
      'USUARIO',
      `Usuário "${nome}" criado`,
      { usuario_id: usuario.id }
    );

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      local: usuario.local,
      descricao: usuario.descricao,
      tipo: usuario.tipo
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

    console.log('Email recebido:', email);
    console.log('Senha recebida:', senha);

    if (!email || !senha) {
      return res.status(400).json({ 
        message: 'Por favor, preencha todos os campos para fazer login.' 
      });
    }

    // Verificar se o email pertence a uma empresa
    const Empresa = require('../models/Empresa');
    const empresaComMesmoEmail = await Empresa.findByEmail(email);
    if (empresaComMesmoEmail) {
      return res.status(401).json({ 
        message: 'Ops! Parece que você está tentando fazer login como candidato, mas este email está cadastrado como empresa. Por favor, clique em "Sou Empresa" e tente novamente.' 
      });
    }

    const usuario = await Usuario.findByEmail(email);
    console.log('Usuário encontrado:', usuario);

    if (!usuario) {
      return res.status(401).json({ 
        message: 'Não encontramos uma conta com este email. Verifique se o email está correto ou cadastre-se como candidato.' 
      });
    }

    console.log('Senha no banco (hash):', usuario.senha);

    const senhaCorreta = await Usuario.comparePassword(senha, usuario.senha);
    console.log('Senha correta?', senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ 
        message: 'Senha incorreta. Por favor, verifique sua senha e tente novamente.' 
      });
    }
    
    // Registrar log de login
    await logsController.logLogin(usuario.id, 0, 'usuario');

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
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: usuario.id, type: 'user' },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      usuario: usuarioFrontend
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Atualizar um usuário
exports.updateUsuario = async (req, res) => {
  try {
    let userId = parseInt(req.params.id, 10);
    
    // Se não houver ID nos parâmetros (rota /atualizar), buscar no corpo
    if (!userId || isNaN(userId)) {
      userId = parseInt(req.body.id, 10);
    }
    
    console.log('ID do usuário recebido:', userId);
    console.log('Tipo do ID:', typeof userId);
    console.log('Dados recebidos para atualização:', req.body);
    console.log('Arquivos recebidos:', req.files);
    
    if (!userId || isNaN(userId)) {
      console.error('ID inválido:', req.params.id || req.body.id);
      return res.status(400).json({ message: 'ID do usuário inválido' });
    }
    
    // Verificar se o usuário existe antes de tentar atualizar
    const usuarioExistente = await Usuario.findById(userId);
    console.log('Usuário existente:', usuarioExistente);
    
    if (!usuarioExistente) {
      console.error('Usuário não encontrado com ID:', userId);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Preparar dados para atualização
    const dadosAtualizacao = { ...req.body };
    
    // Processar arquivos enviados
    if (req.files) {
      if (req.files.foto && req.files.foto[0]) {
        dadosAtualizacao.foto = req.files.foto[0].path.replace(/\\/g, '/');
      }
      if (req.files.curriculo && req.files.curriculo[0]) {
        dadosAtualizacao.curriculo = req.files.curriculo[0].path.replace(/\\/g, '/');
      }
      if (req.files.certificados && req.files.certificados[0]) {
        dadosAtualizacao.certificados = req.files.certificados[0].path.replace(/\\/g, '/');
      }
    }
    
    // Atualizar o usuário
    console.log('Iniciando atualização do usuário...');
    const result = await Usuario.update(userId, dadosAtualizacao);
    console.log('Resultado da atualização:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Buscar os dados atualizados do usuário para retornar ao cliente
    console.log('Buscando dados atualizados do usuário...');
    const usuarioAtualizado = await Usuario.findById(userId);
    console.log('Dados atualizados encontrados:', usuarioAtualizado);
    
    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Erro ao buscar dados atualizados do usuário' });
    }
    
    // Registrar log de atualização de perfil
    await logsController.logAtualizacaoPerfil(userId, 0, 'usuario');
    
    // Criar notificação de perfil atualizado
    await NotificacaoService.criarNotificacaoPerfilAtualizado(userId, 0, false);
    
    // Retornar os dados atualizados do usuário
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error('Erro detalhado ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};

// Excluir um usuário
exports.deleteUsuario = async (req, res) => {
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
exports.getPerfil = async (req, res) => {
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

exports.updateSenha = async (req, res) => {
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

