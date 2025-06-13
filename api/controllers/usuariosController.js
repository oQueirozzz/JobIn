import Usuario from '../models/Usuario.js';
import * as logsController from './logsController.js';
import NotificacaoService from '../services/notificacaoService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Empresa from '../models/Empresa.js';
import path from 'path';
import fs from 'fs';

// Importar para definir __dirname em módulos ES
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      console.log(`Usuário com ID ${id} não encontrado.`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Robustly parse certificados to ensure it's an array before sending to frontend
    let parsedCertificados = [];
    if (usuario.certificados) {
      try {
        let tempCertificados = JSON.parse(usuario.certificados);
        parsedCertificados = Array.isArray(tempCertificados)
          ? tempCertificados
          : JSON.parse(tempCertificados);
      } catch (parseError) {
        console.warn('Backend: Could not parse certificados as JSON. Treating as plain text or single item.', parseError);
        parsedCertificados = [usuario.certificados];
      }
    }
    if (!Array.isArray(parsedCertificados)) {
      parsedCertificados = [];
    }

    const usuarioToSend = {
      ...usuario,
      certificados: parsedCertificados
    };
    
    console.log('Usuário encontrado e certificados processados:', usuarioToSend);
    res.status(200).json(usuarioToSend);
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
      data_nascimento: req.body.data_nascimento,
      descricao,
      area_interesse: req.body.area_interesse,
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
      data_nascimento: usuario.data_nascimento || null,
      descricao: usuario.descricao || null,
      formacao: usuario.formacao || null,
      area_interesse: usuario.area_interesse || null,
      habilidades: usuario.habilidades || null,
      curriculo: usuario.curriculo || null,
      certificados: usuario.certificados || null,
      tipo: usuario.tipo
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

    console.log('Usuário encontrado para comparação de senha:', {
      id: usuario.id,
      email: usuario.email,
      hashedPasswordFromDB: usuario.senha ? '[PRESENTE]' : '[AUSENTE]' // Indica se a senha criptografada está presente
    });

    console.log('Verificando senha. Senha recebida (parcial):', senha.substring(0, 3) + '...');
    console.log('Senha completa recebida:', senha); // ADICIONADO PARA DEPURACAO
    console.log('Senha hashada do banco de dados:', usuario.senha); // ADICIONADO PARA DEPURACAO
    const senhaCorreta = await Usuario.comparePassword(senha, usuario.senha);
    console.log('Resultado da comparação de senha (bcrypt.compare):', senhaCorreta);

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
      cpf: usuario.cpf || '',
      data_nascimento: usuario.data_nascimento || '',
      formacao: usuario.formacao || '',
      area_interesse: usuario.area_interesse || '',
      habilidades: usuario.habilidades || '',
      descricao: usuario.descricao || '',
      curriculo: usuario.curriculo || null,
      certificados: usuario.certificados || null,
      foto: usuario.foto || null,
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
    const { id } = req.params;
    const dadosAtualizacao = { ...req.body };
    
    // Remover campos que não devem ser atualizados diretamente
    delete dadosAtualizacao.senha;
    delete dadosAtualizacao.id;
    delete dadosAtualizacao.tipo_usuario;
    delete dadosAtualizacao.data_criacao;
    delete dadosAtualizacao.data_atualizacao;
    
    // Processar arquivos se houver upload
    if (req.files) {
      if (req.files.foto && req.files.foto[0]) {
        dadosAtualizacao.foto = `/uploads/usuarios/${req.files.foto[0].filename}`;
      }
      if (req.files.curriculo && req.files.curriculo[0]) {
        dadosAtualizacao.curriculo = `/uploads/usuarios/${req.files.curriculo[0].filename}`;
      }
      if (req.files.certificados && req.files.certificados[0]) {
        dadosAtualizacao.certificados = `/uploads/usuarios/${req.files.certificados[0].filename}`;
      }
    }

    // Se curriculo for explicitamente null, remover o arquivo antigo
    if (dadosAtualizacao.curriculo === null) {
      console.log('Tentando remover currículo antigo...');
      const usuario = await Usuario.findById(id);
      if (usuario && usuario.curriculo) {
        console.log('Currículo existente no DB:', usuario.curriculo);
        const oldPath = path.join(__dirname, '..', '..', 'frontend', 'public', usuario.curriculo);
        console.log('Caminho antigo do currículo (full):', oldPath);
        if (fs.existsSync(oldPath)) {
          console.log('Arquivo de currículo antigo encontrado. Excluindo...');
          try {
            fs.unlinkSync(oldPath);
            console.log('Currículo antigo excluído com sucesso do disco.');
          } catch (unlinkError) {
            console.error('ERRO ao excluir currículo antigo do disco:', unlinkError);
            // Não rethrow para não impedir a atualização do DB se o problema for apenas o arquivo
          }
        } else {
          console.log('Arquivo de currículo antigo NÃO encontrado no caminho especificado:', oldPath);
        }
      } else {
        console.log('Usuário ou currículo não encontrado para remoção.');
      }
    }

    // Se foto for explicitamente null, remover o arquivo antigo
    if (dadosAtualizacao.foto === null) {
      const usuario = await Usuario.findById(id);
      if (usuario && usuario.foto) {
        const oldPath = path.join(__dirname, '..', '..', 'frontend', 'public', usuario.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // Se certificados for explicitamente null, remover o arquivo antigo
    if (dadosAtualizacao.certificados === null) {
      const usuario = await Usuario.findById(id);
      if (usuario && usuario.certificados) {
        const oldPath = path.join(__dirname, '..', '..', 'frontend', 'public', usuario.certificados);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }
    
    console.log('Dados a serem atualizados no DB:', dadosAtualizacao); // LOG para depuração
    const usuario = await Usuario.update(id, dadosAtualizacao);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    console.log('Objeto de usuário retornado pelo DB:', usuario); // LOG para depuração
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Excluir um usuário
export const deleteUsuario = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    console.log(`[DELETE USUARIO] Tentando excluir usuário com ID: ${userIdToDelete}`);

    // Verifica se o usuário está tentando excluir sua própria conta
    if (req.usuario.id !== parseInt(userIdToDelete)) {
      console.log(`[DELETE USUARIO] Tentativa de excluir conta de outro usuário. Usuário autenticado: ${req.usuario.id}, Tentativa de excluir: ${userIdToDelete}`);
      return res.status(403).json({ message: 'Você não tem permissão para excluir esta conta' });
    }

    const usuario = await Usuario.findById(userIdToDelete);
    if (!usuario) {
      console.log(`[DELETE USUARIO] Usuário com ID ${userIdToDelete} não encontrado.`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const deletedUser = await Usuario.delete(userIdToDelete);

    if (deletedUser) {
      console.log(`[DELETE USUARIO] Usuário com ID ${userIdToDelete} excluído com sucesso.`, deletedUser);
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } else {
      console.warn(`[DELETE USUARIO] Usuário com ID ${userIdToDelete} não foi excluído, mas não houve erro. Pode ser que não existisse.`);
      res.status(404).json({ message: 'Usuário não encontrado ou não pôde ser excluído.' });
    }
  } catch (error) {
    console.error(`[DELETE USUARIO] Erro ao excluir usuário com ID ${req.params.id}:`, error);
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

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
    }

    // Buscar o usuário, incluindo a senha
    const usuario = await Usuario.findById(id, true); // Passar true para incluir a senha
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
    await NotificacaoService.criarNotificacaoSenhaAlterada(id, null, false);

    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
};

