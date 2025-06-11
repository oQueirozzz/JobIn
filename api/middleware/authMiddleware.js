import jwt from 'jsonwebtoken';

// Middleware de autenticação
export const protect = (req, res, next) => {
  try {
    console.log('[AuthMiddleware] Verificando autenticação');
    
    // Obter o token do header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AuthMiddleware] Token não fornecido ou formato inválido');
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('[AuthMiddleware] Token não encontrado no header');
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    console.log('[AuthMiddleware] Token encontrado, verificando...');

    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua-chave-secreta');
    console.log('[AuthMiddleware] Token decodificado:', { id: decoded.id, type: decoded.type });
    
    // Adicionar informações do usuário ao request
    req.usuario = {
      id: decoded.id,
      type: decoded.type,
      isAuthenticated: true
    };

    console.log('[AuthMiddleware] Autenticação bem-sucedida');
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Erro na autenticação:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(500).json({ message: 'Erro na autenticação' });
  }
};

// Middleware para verificar se é uma empresa
export const empresa = (req, res, next) => {
  if (!req.usuario || req.usuario.type !== 'company') {
    return res.status(403).json({ message: 'Acesso permitido apenas para empresas' });
  }
  next();
};

// Middleware para verificar se é um usuário
export const usuario = (req, res, next) => {
  if (!req.usuario || req.usuario.type !== 'user') {
    return res.status(403).json({ message: 'Acesso permitido apenas para usuários' });
  }
  next();
};

export default{ protect, empresa, usuario };
