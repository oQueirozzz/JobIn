import express from 'express';
const router = express.Router();
import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuração do __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Caminho para a pasta public do frontend
    const uploadPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads', 'posts');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});

// Criar um novo post
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { empresa_id, titulo, conteudo } = req.body;
    const imagem = req.file ? `/uploads/posts/${req.file.filename}` : null;

    const query = `
      INSERT INTO posts (empresa_id, titulo, conteudo, imagem)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [empresa_id, titulo, conteudo, imagem]);
    
    res.status(201).json({
      id: result.insertId,
      empresa_id,
      titulo,
      conteudo,
      imagem,
      data_publicacao: new Date()
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Buscar todos os posts
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT p.*, e.nome as nome_empresa, e.logo as logo_empresa
      FROM posts p
      JOIN empresas e ON p.empresa_id = e.id
      ORDER BY p.data_publicacao DESC
    `;

    const [posts] = await db.execute(query);
    res.json(Array.isArray(posts) ? posts : []);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Buscar posts de uma empresa específica
router.get('/empresa/:empresa_id', async (req, res) => {
  try {
    const { empresa_id } = req.params;
    const query = `
      SELECT p.*, e.nome as nome_empresa, e.logo as logo_empresa
      FROM posts p
      JOIN empresas e ON p.empresa_id = e.id
      WHERE p.empresa_id = ?
      ORDER BY p.data_publicacao DESC
    `;

    const [posts] = await db.execute(query, [empresa_id]);
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts da empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar posts da empresa' });
  }
});

// Deletar um post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM posts WHERE id = ?';
    
    await db.execute(query, [id]);
    res.status(200).json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

export default router; 