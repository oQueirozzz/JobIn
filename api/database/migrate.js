import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'jobin',
  password: 'postgres',
  port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', '001_create_logs_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Executar a migração
    await client.query(migrationSQL);
    console.log('Migração executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migração:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate(); 