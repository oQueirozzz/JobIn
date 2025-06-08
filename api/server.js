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
import notificacoesRoutes from './routes/notificacoesRoutes.js';
import rotasRoutes from './routes/rotas.js';
import pontosRotasRoutes from './routes/pontosRotas.js';
import postsRoutes from './routes/posts.js';
import './jobs/notificacaoTeste.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar pasta de uploads como estática
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'frontend', 'public', 'uploads')));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});