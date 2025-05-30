require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const empresasRoutes = require('./routes/empresas');
const vagasRoutes = require('./routes/vagas');
const candidaturasRoutes = require('./routes/candidaturas');
const chatRoutes = require('./routes/chat');
const logsRoutes = require('./routes/logs');
const notificacoesRoutes = require('./routes/notificacoes');
const rotasRoutes = require('./routes/rotas');
const pontosRotasRoutes = require('./routes/pontosRotas');
const postsRoutes = require('./routes/posts');
const path = require('path');
const fs = require('fs');
require('./jobs/notificacaoTeste');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configurar pasta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Criar pasta de uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads', 'posts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/vagas', vagasRoutes);
app.use('/api/candidaturas', candidaturasRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/rotas', rotasRoutes);
app.use('/api/pontos-rotas', pontosRotasRoutes);
app.use('/api/posts', postsRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do JobIn' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});