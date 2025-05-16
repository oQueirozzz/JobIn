# Serviço de API com Gerenciamento Automático de Token

Este serviço implementa um cliente HTTP baseado em Axios que gerencia automaticamente o token JWT de autenticação, eliminando a necessidade de configurar manualmente o token no Thunder Client ou em outras ferramentas de teste de API.

## Funcionalidades

- **Configuração automática do token**: O token é automaticamente incluído em todas as requisições após o login
- **Armazenamento seguro**: O token é armazenado no localStorage do navegador
- **Interceptores**: Adiciona automaticamente o token no cabeçalho de autorização de todas as requisições
- **Tratamento de erros**: Gerencia automaticamente erros de autenticação (401)

## Como usar

### 1. Importar o serviço de API

```javascript
import api, { setAuthToken } from '../services/api';
```

### 2. Fazer login e obter o token

```javascript
const fazerLogin = async (email, senha) => {
  try {
    const response = await api.post('/usuarios/login', { email, senha });
    const { token } = response.data;
    
    // O token é automaticamente configurado para todas as requisições futuras
    setAuthToken(token);
    
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
```

### 3. Fazer requisições autenticadas

```javascript
const obterPerfilUsuario = async () => {
  try {
    // O token é incluído automaticamente no cabeçalho da requisição
    const response = await api.get('/usuarios/perfil');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    throw error;
  }
};
```

### 4. Fazer logout

```javascript
const fazerLogout = () => {
  // Remove o token
  setAuthToken(null);
};
```

## Integração com o AuthContext

O serviço de API está integrado com o AuthContext para gerenciar o estado de autenticação do usuário em toda a aplicação. O token é automaticamente configurado durante o login e removido durante o logout.

## Vantagens

- Elimina a necessidade de configurar manualmente o token no Thunder Client
- Centraliza a lógica de autenticação
- Facilita o gerenciamento do token em toda a aplicação
- Melhora a segurança ao tratar automaticamente tokens expirados ou inválidos