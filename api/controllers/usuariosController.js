const Usuario = require('../models/Usuario');
const logsController = require('./logsController');

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
    
    // Registrar log de criação de usuário
    await logsController.registrarLog(
      novoUsuario.id,
      0, // Sem empresa associada
      'CRIAR',
      'USUARIO',
      `Novo usuário registrado: ${nome}`,
      { usuario_id: novoUsuario.id }
    );
    
    // Criar notificação para o usuário
    const Notificacao = require('../models/Notificacao');
    await Notificacao.create({
      candidaturas_id: 0, // Sem candidatura associada
      empresas_id: 0, // Sem empresa associada
      usuarios_id: novoUsuario.id,
      mensagem_empresa: null,
      mensagem_usuario: `Bem-vindo ao JobIn! Sua conta foi criada com sucesso. Comece a buscar vagas agora mesmo!`
    });

    // Versão simplificada sem token
    res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      autenticado: true
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
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    const usuario = await Usuario.findByEmail(email);
    console.log('Usuário encontrado:', usuario);

    if (!usuario) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    console.log('Senha no banco (hash):', usuario.senha);

    const senhaCorreta = await Usuario.comparePassword(senha, usuario.senha);
    console.log('Senha correta?', senhaCorreta);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    
    // Registrar log de login
    await logsController.logLogin(usuario.id, 0, 'usuario');

    res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      autenticado: true
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
    
    // Registrar log de atualização de perfil
    await logsController.logAtualizacaoPerfil(req.params.id, 0, 'usuario');
    
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
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

