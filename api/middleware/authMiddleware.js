const jwt = require('jsonwebtoken');

// Middleware de autenticação simplificado
// Esta versão permite acesso sem verificação de token
exports.protect = (req, res, next) => {
  // Versão simplificada que não verifica token
  // Apenas passa para o próximo middleware
  console.log('Middleware de autenticação: acesso permitido sem token');
  
  // Simula um usuário autenticado para manter compatibilidade com código existente
  req.usuario = {
    id: null,  // ID nulo para indicar que não há autenticação real
    isAuthenticated: true  // Marca como autenticado para compatibilidade
  };
  
  next();
};

// Função auxiliar para verificar se o usuário é uma empresa
// Mantida para compatibilidade, mas sempre retorna verdadeiro
exports.empresa = (req, res, next) => {
  // Versão simplificada que não verifica se é empresa
  console.log('Middleware de verificação de empresa: acesso permitido sem verificação');
  next();
};