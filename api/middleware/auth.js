import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua-chave-secreta');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}; 