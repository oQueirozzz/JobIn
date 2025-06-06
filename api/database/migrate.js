import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  host: 'dpg-d0nu3ifdiees739f2qo0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'database_postgre_ensr',
  user: 'database_postgre_ensr_user',
  ssl: true
});

async function migrate() {
  const client = await pool.connect();
  try {
    // Get all migration files and sort them
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Execute each migration in order
    for (const file of migrationFiles) {
      console.log(`Executing migration: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      await client.query(migrationSQL);
      console.log(`Migration ${file} completed successfully`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Error executing migrations:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate(); 