require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios.js');
const empresasRoutes = require('./routes/empresas.js');
const vagasRoutes = require('./routes/vagas.js');
const candidaturasRoutes = require('./routes/candidaturas.js');
const chatRoutes = require('./routes/chat.js');
const logsRoutes = require('./routes/logs.js');
const notificacoesRoutes = require('./routes/notificacoes.js');
const rotasRoutes = require('./routes/rotas.js');
const pontosRotasRoutes = require('./routes/pontosRotas.js');
const postsRoutes = require('./routes/posts.js');
const path = require('path');
const fs = require('fs');
require('./jobs/notificacaoTeste');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'https://jobin-mu.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como de mobile apps ou curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Lidar explicitamente com preflight requests
app.options('*', cors());


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configurar pasta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Criar pastas de uploads se não existirem
const uploadsPostsDir = path.join(__dirname, 'uploads', 'posts');
const uploadsUsuariosDir = path.join(__dirname, 'uploads', 'usuarios');

if (!fs.existsSync(uploadsPostsDir)) {
  fs.mkdirSync(uploadsPostsDir, { recursive: true });
}

if (!fs.existsSync(uploadsUsuariosDir)) {
  fs.mkdirSync(uploadsUsuariosDir, { recursive: true });
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