const { Pool } = require('pg');
require('dotenv').config();

const pool = process.env.DATABASE_URL 
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL, 
      ssl: { rejectUnauthorized: false } 
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'tasknest',
      port: process.env.DB_PORT || 5432,
    });

pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
