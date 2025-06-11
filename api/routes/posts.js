import express from 'express';
const router = express.Router();
import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { verificarToken } from '../middleware/auth.js'; // Importar o middleware de autenticação

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
router.post('/', verificarToken, upload.single('imagem'), async (req, res) => {
  try {
    // Apenas empresas podem criar posts
    if (req.usuario.type !== 'company') {
      return res.status(403).json({ error: 'Apenas empresas podem criar posts.' });
    }
    const empresa_id = req.usuario.id; // Pega o ID da empresa do token
    const { titulo, conteudo } = req.body;
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

    res.status(201).json({
      id: result.rows[0].id, // PostgreSQL retorna o ID em rows[0] se usar RETURNING
      empresa_id,
      titulo,
      conteudo,
      imagem,
      data_publicacao: new Date()
    });
  } catch (error) {
    console.error('Erro ao criar post (detalhes):', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// Buscar todos os posts
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // ID do usuário autenticado

    const query = `
      SELECT 
          p.*, 
          e.nome as nome_empresa, 
          e.logo as logo_empresa,
          COUNT(pl.id) AS likes_count, -- Contagem total de likes
          EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND usuario_id = $1) AS liked_by_user -- Verifica se o usuário atual curtiu
      FROM posts p
      JOIN empresas e ON p.empresa_id = e.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      GROUP BY p.id, e.id
      ORDER BY p.data_publicacao DESC
    `;

    const result = await db.query(query, [usuarioId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// Buscar posts de uma empresa específica
router.get('/empresa/:empresa_id', verificarToken, async (req, res) => {
  try {
    const { empresa_id } = req.params;
    const usuarioId = req.usuario.id; // ID do usuário autenticado

    const query = `
      SELECT 
          p.*, 
          e.nome as nome_empresa, 
          e.logo as logo_empresa,
          COUNT(pl.id) AS likes_count, -- Contagem total de likes
          EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND usuario_id = $1) AS liked_by_user -- Verifica se o usuário atual curtiu
      FROM posts p
      JOIN empresas e ON p.empresa_id = e.id
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      WHERE p.empresa_id = $2
      GROUP BY p.id, e.id
      ORDER BY p.data_publicacao DESC
    `;

    const result = await db.query(query, [usuarioId, empresa_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar posts da empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar posts da empresa' });
  }
});

// Dar like em um post
router.post('/:id/like', verificarToken, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const usuarioId = req.usuario.id; // ID do usuário do token

    // Verifica se o usuário é uma empresa e impede de dar like
    if (req.usuario.type === 'company') {
      return res.status(403).json({ error: 'Empresas não podem dar like em posts.' });
    }

    const query = `
      INSERT INTO post_likes (post_id, usuario_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, usuario_id) DO NOTHING; -- Evita likes duplicados
    `;
    await db.query(query, [postId, usuarioId]);

    res.status(200).json({ message: 'Like registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao dar like no post:', error);
    res.status(500).json({ error: 'Erro ao dar like no post' });
  }
});

// Remover like de um post
router.delete('/:id/like', verificarToken, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const usuarioId = req.usuario.id; // ID do usuário do token

    // Verifica se o usuário é uma empresa e impede de dar unlike
    if (req.usuario.type === 'company') {
      return res.status(403).json({ error: 'Empresas não podem remover like de posts.' });
    }

    const query = 'DELETE FROM post_likes WHERE post_id = $1 AND usuario_id = $2';
    await db.query(query, [postId, usuarioId]);

    res.status(200).json({ message: 'Like removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover like do post:', error);
    res.status(500).json({ error: 'Erro ao remover like do post' });
  }
});

// Deletar um post
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Apenas a empresa que criou o post ou um admin pode deletar
    // req.usuario.id é o ID da empresa do token
    // req.usuario.type é o tipo de usuário (company/user)
    
    // Primeiro, verifique se o post pertence à empresa
    const checkQuery = 'SELECT empresa_id FROM posts WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    const postEmpresaId = checkResult.rows[0].empresa_id;

    if (req.usuario.type === 'company' && req.usuario.id === postEmpresaId) {
      const query = 'DELETE FROM posts WHERE id = $1';
      await db.query(query, [id]);
      res.status(200).json({ message: 'Post deletado com sucesso' });
    } else {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este post.' });
    }

  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

export default router; 