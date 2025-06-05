import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import Empresa from '../models/Empresa.js';
import NotificacaoService from '../services/notificacaoService.js';

// Alterar senha
export const alterarSenha = async (req, res) => {
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
}; 