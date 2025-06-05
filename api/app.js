import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import vagaRoutes from './routes/vagaRoutes.js';
import candidaturaRoutes from './routes/candidaturaRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import postRoutes from './routes/postRoutes.js';
import notificacoesRoutes from './routes/notificacoesRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/vagas', vagaRoutes);
app.use('/api/candidaturas', candidaturaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notificacoes', notificacoesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 