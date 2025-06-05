import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Log das variáveis de ambiente (sem mostrar a senha)
console.log('Configuração do banco de dados:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('SSL:', process.env.DB_SSL === 'true');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
});

// Testar a conexão
pool.on('connect', () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
});

pool.on('error', (err) => {
    console.error('Erro inesperado na conexão com o banco de dados:', err);
});

// Função para testar a conexão
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Teste de conexão bem-sucedido');
        client.release();
    } catch (error) {
        console.error('Erro ao testar conexão com o banco de dados:', error);
        throw error;
    }
};

// Testar a conexão ao iniciar
testConnection().catch(console.error);

export default pool;
