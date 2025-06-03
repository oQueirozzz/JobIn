require('dotenv').config();
const mysql = require('mysql2/promise');

// Verificar se as variáveis de ambiente estão sendo carregadas
console.log('Verificando variáveis de ambiente:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD está definida:', !!process.env.DB_PASSWORD);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jobin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  maxAllowedPacket: 1073741824, // 1GB
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Testar a conexão
pool.getConnection()
  .then(connection => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
  });

module.exports = pool;