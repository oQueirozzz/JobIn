import jwt from 'jsonwebtoken';
import { read, compare } from '../config/db.js';

const loginController = async (req, res) => {
    const {email, senha} = req.body;
    try{
        const usuario = await read('usuarios', `email = '${email}'`);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado'});
        }

        const senhaCorreta = await compare(senha, usuario.senha);

        if(!senhaCorreta) {
            return res.status(401).json({mensagem: 'Senha incorreta'})
        }

        const token = jwt.sign({id:usuario.id, tipo:usuario.tipo}, JWT_SECRET, {expiresIn: '7d'});
        res.status(200).json({mensagem: 'Login realizado com sucesso', token});
    } catch (err) {
        console.error('Erro ao fazer login: ', err);
        res.status(500).json({mensagem: 'Erro ao fazer login'});
    }
};

export { loginController };