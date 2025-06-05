import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import usuariosRoutes from './routes/usuarios.js';
import empresasRoutes from './routes/empresas.js';
import vagasRoutes from './routes/vagas.js';
import candidaturasRoutes from './routes/candidaturas.js';
import chatRoutes from './routes/chat.js';
import logsRoutes from './routes/logs.js';
import notificacoesRoutes from './routes/notificacoes.js';
import rotasRoutes from './routes/rotas.js';
import pontosRotasRoutes from './routes/pontosRotas.js';
import postsRoutes from './routes/posts.js';
import './jobs/notificacaoTeste.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Obter o diretório atual em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ['https://jobin-mu.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));

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