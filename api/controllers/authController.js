import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import Empresa from '../models/Empresa.js';
import NotificacaoService from '../services/notificacaoService.js';
import jwt from 'jsonwebtoken';

class AuthController {
  // Alterar senha
  static async alterarSenha(req, res) {
    try {
      const { id, senha_atual, nova_senha, tipo } = req.body;

      // Validar campos
      if (!id || !senha_atual || !nova_senha || !tipo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      let usuario;
      let empresa;

      // Buscar usuário ou empresa
      if (tipo === 'usuario') {
        usuario = await Usuario.findById(id);
        if (!usuario) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar senha atual
        const senhaCorreta = await bcrypt.compare(senha_atual, usuario.senha);
        if (!senhaCorreta) {
          return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        // Criptografar nova senha
        const senhaCriptografada = await bcrypt.hash(nova_senha, 10);

        // Atualizar senha
        await Usuario.updateSenha(id, senhaCriptografada);

        // Criar notificação
        await NotificacaoService.criarNotificacaoSenhaAlterada(id, 0, false);

        res.status(200).json({ message: 'Senha alterada com sucesso' });
      } else if (tipo === 'empresa') {
        empresa = await Empresa.findById(id);
        if (!empresa) {
          return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        // Verificar senha atual
        const senhaCorreta = await bcrypt.compare(senha_atual, empresa.senha);
        if (!senhaCorreta) {
          return res.status(401).json({ message: 'Senha atual incorreta' });
        }

        // Criptografar nova senha
        const senhaCriptografada = await bcrypt.hash(nova_senha, 10);

        // Atualizar senha
        await Empresa.updateSenha(id, senhaCriptografada);

        // Criar notificação
        await NotificacaoService.criarNotificacaoSenhaAlterada(0, id, true);

        res.status(200).json({ message: 'Senha alterada com sucesso' });
      } else {
        res.status(400).json({ message: 'Tipo inválido' });
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ message: 'Erro ao alterar senha' });
    }
  }

  static async login(req, res) {
    try {
      console.log('[AuthController] Iniciando processo de login');
      const { email, senha } = req.body;
      
      if (!email || !senha) {
        console.log('[AuthController] Email ou senha não fornecidos');
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      console.log('[AuthController] Buscando usuário por email:', email);
      const usuario = await Usuario.findByEmail(email);
      
      if (!usuario) {
        console.log('[AuthController] Usuário não encontrado');
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      console.log('[AuthController] Verificando senha');
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        console.log('[AuthController] Senha inválida');
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      console.log('[AuthController] Gerando token JWT');
      const token = jwt.sign(
        { 
          id: usuario.id,
          email: usuario.email,
          type: usuario.tipo === 'empresa' ? 'company' : 'user'
        },
        process.env.JWT_SECRET || 'sua-chave-secreta',
        { expiresIn: '24h' }
      );

      // Remove a senha do objeto antes de enviar
      const { senha: _, ...usuarioSemSenha } = usuario;

      console.log('[AuthController] Login bem-sucedido para usuário:', usuario.id);
      res.json({
        usuario: usuarioSemSenha,
        token
      });
    } catch (error) {
      console.error('[AuthController] Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default AuthController; 