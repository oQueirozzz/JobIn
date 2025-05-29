![](./frontend/public/img/global/logo_completa.svg)

## Estrutura do Projeto
- `frontend/`: Aplicação Next.js
- `backend/`: API Node.js/Express
- `database/`: MySQL

## Deploy

### Backend (API)
1. Crie uma conta no Render
2. Crie um novo Web Service
3. Conecte o repositório
4. Configure as variáveis de ambiente:
   - MYSQL
   - JWT_SECRET
   - PORT

### Frontend
1. Crie outro Web Service no Render
2. Conecte o repositório do frontend
3. Configure as variáveis de ambiente:
   - NEXT_PUBLIC_API_URL

### Banco de Dados
1. Crie uma conta no MySQL
2. Crie um novo cluster
3. Configure o IP de acesso
4. Copie a string de conexão

## Desenvolvimento Local

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tecnologias Utilizadas
- Frontend: Next.js, TailwindCSS
- Backend: Node.js, Express
- Database: MySQL
- Deploy: Render 
