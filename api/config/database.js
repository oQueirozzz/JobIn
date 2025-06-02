const mysql = require('mysql2/promise');

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

module.exports = pool;