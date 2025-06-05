import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Log das variáveis de ambiente (sem mostrar a senha)
console.log('Configuração do banco de dados:');
console.log('Host:', process.env.DB_HOST || 'dpg-d0nu3ifdiees739f2qo0-a.oregon-postgres.render.com');
console.log('Port:', process.env.DB_PORT || '5432');
console.log('User:', process.env.DB_USER || 'database_postgre_ensr_user');
console.log('Database:', process.env.DB_NAME || 'database_postgre_ensr');
console.log('SSL:', process.env.DB_SSL === 'true');

const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d0nu3ifdiees739f2qo0-a.oregon-postgres.render.com',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'database_postgre_ensr',
    user: process.env.DB_USER || 'database_postgre_ensr_user',
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database');
    release();
});

// Função para testar a conexão
const testConnection = async () => {
    let client;
    try {
        console.log('Tentando conectar ao banco de dados...');
        console.log('Configuração:', {
            host: process.env.DB_HOST || 'dpg-d0nu3ifdiees739f2qo0-a.oregon-postgres.render.com',
            port: process.env.DB_PORT || '5432',
            database: process.env.DB_NAME || 'database_postgre_ensr',
            user: process.env.DB_USER || 'database_postgre_ensr_user',
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
    console.error('4. Se o banco de dados "database_postgre_ensr" existe');
});

export default pool;
