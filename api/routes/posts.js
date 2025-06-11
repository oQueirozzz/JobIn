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
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const values = [empresa_id, titulo, conteudo, imagem];

    console.log('[DEBUG POST] Query de inserção:', query);
    console.log('[DEBUG POST] Valores para inserção:', values);

    const result = await db.query(query, values);
    
    console.log('[DEBUG POST] Resultado da query de inserção:', result);

    // Buscar o nome da empresa
    const empresaQuery = 'SELECT nome FROM empresas WHERE id = $1';
    const empresaResult = await db.query(empresaQuery, [empresa_id]);

    // Ajustar o horário para o fuso do Brasil (UTC-3)
    const dataAtual = new Date();
    dataAtual.setHours(dataAtual.getHours() + 3);

    res.status(201).json({
      id: result.rows[0].id,
      empresa_id,
      titulo,
      conteudo,
      imagem,
      nome_empresa: empresaResult.rows[0].nome,
      data_publicacao: dataAtual
    });
  } catch (error) {
    console.error('Erro ao criar post (detalhes):', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Buscar todos os posts
router.get('/', async (req, res) => {
  try {
    const { usuario_id } = req.query; // Pegar o ID do usuário da query string

    const query = `
      SELECT 
          p.*, 
          e.nome as nome_empresa, 
          e.logo as logo_empresa,
          COUNT(pl.id) AS likes_count,
          (p.data_publicacao AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as data_publicacao,
          EXISTS(
            SELECT 1 
            FROM post_likes pl2 
            WHERE pl2.post_id = p.id 
            AND pl2.usuario_id = $1
          ) as liked_by_user
      FROM posts p
      JOIN empresas e ON p.empresa_id = e.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      GROUP BY p.id, e.id
      ORDER BY p.data_publicacao DESC
    `;

    const result = await db.query(query, [usuario_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Buscar posts de uma empresa específica
router.get('/empresa/:empresa_id', async (req, res) => {
  try {
    const { empresa_id } = req.params;
    const { usuario_id } = req.query; // Pegar o ID do usuário da query string

    const query = `
      SELECT 
          p.*, 
          e.nome as nome_empresa, 
          e.logo as logo_empresa,
          COUNT(pl.id) AS likes_count,
          (p.data_publicacao AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as data_publicacao,
          EXISTS(
            SELECT 1 
            FROM post_likes pl2 
            WHERE pl2.post_id = p.id 
            AND pl2.usuario_id = $1
          ) as liked_by_user
      FROM posts p
      JOIN empresas e ON p.empresa_id = e.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      WHERE p.empresa_id = $2
      GROUP BY p.id, e.id
      ORDER BY p.data_publicacao DESC
    `;

    const result = await db.query(query, [usuario_id, empresa_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar posts da empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar posts da empresa' });
  }
});

// Dar like em um post
router.post('/:id/like', async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { usuario_id } = req.body;

    const query = `
      INSERT INTO post_likes (post_id, usuario_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, usuario_id) DO NOTHING;
    `;
    await db.query(query, [postId, usuario_id]);

    // Buscar a contagem atualizada de likes
    const countQuery = `
      SELECT COUNT(*) as likes_count
      FROM post_likes
      WHERE post_id = $1
    `;
    const countResult = await db.query(countQuery, [postId]);

    res.json({ likes_count: parseInt(countResult.rows[0].likes_count) });
  } catch (error) {
    console.error('Erro ao dar like no post:', error);
    res.status(500).json({ error: 'Erro ao dar like no post' });
  }
});

// Remover like de um post
router.delete('/:id/like', async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { usuario_id } = req.body;

    const query = 'DELETE FROM post_likes WHERE post_id = $1 AND usuario_id = $2';
    await db.query(query, [postId, usuario_id]);

    // Buscar a contagem atualizada de likes
    const countQuery = `
      SELECT COUNT(*) as likes_count
      FROM post_likes
      WHERE post_id = $1
    `;
    const countResult = await db.query(countQuery, [postId]);

    res.json({ likes_count: parseInt(countResult.rows[0].likes_count) });
  } catch (error) {
    console.error('Erro ao remover like do post:', error);
    res.status(500).json({ error: 'Erro ao remover like do post' });
  }
});

// Deletar um post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { empresa_id } = req.body;
    
    // Primeiro, verifique se o post pertence à empresa
    const checkQuery = 'SELECT empresa_id FROM posts WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    const postEmpresaId = checkResult.rows[0].empresa_id;

    if (empresa_id === postEmpresaId) {
      const query = 'DELETE FROM posts WHERE id = $1';
      await db.query(query, [id]);
      res.json({ message: 'Post deletado com sucesso.' });
    } else {
      res.status(403).json({ error: 'Você não tem permissão para deletar este post.' });
    }
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

export default router; 