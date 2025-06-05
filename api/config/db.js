import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Log das variáveis de ambiente (sem mostrar a senha)
console.log('Configuração do banco de dados:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || '5432');
console.log('User:', process.env.DB_USER || 'postgres');
console.log('Database:', process.env.DB_NAME || 'jobin');
console.log('SSL:', process.env.DB_SSL === 'true');

// Configuração do pool com timeout maior
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'jobin',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Aumentado para 10 segundos
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Testar a conexão
pool.on('connect', () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
});

pool.on('error', (err) => {
    console.error('Erro inesperado na conexão com o banco de dados:', err);
    console.error('Detalhes do erro:', {
        code: err.code,
        message: err.message,
        stack: err.stack
    });
});

// Função para testar a conexão
const testConnection = async () => {
    let client;
    try {
        console.log('Tentando conectar ao banco de dados...');
        console.log('Configuração:', {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            database: process.env.DB_NAME || 'jobin',
            user: process.env.DB_USER || 'postgres',
            ssl: process.env.DB_SSL === 'true'
        });

        client = await pool.connect();
        console.log('Teste de conexão bem-sucedido');
        
        // Testar uma query simples
        const result = await client.query('SELECT NOW()');
        console.log('Query de teste executada com sucesso:', result.rows[0]);
        
        client.release();
    } catch (error) {
        console.error('Erro ao testar conexão com o banco de dados:', error);
        console.error('Detalhes do erro:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        
        if (client) {
            client.release();
        }
        throw error;
    }
};

// Testar a conexão ao iniciar
testConnection().catch(error => {
    console.error('Falha ao conectar com o banco de dados:', error);
    console.error('Por favor, verifique:');
    console.error('1. Se as variáveis de ambiente estão configuradas corretamente');
    console.error('2. Se o PostgreSQL está rodando localmente');
    console.error('3. Se as credenciais estão corretas');
    console.error('4. Se o banco de dados "jobin" existe');
});

export default pool;
