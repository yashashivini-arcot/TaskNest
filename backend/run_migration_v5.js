const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'tasknest'
});

async function migrate() {
    const migrationPath = path.join(__dirname, 'db', 'migration_v5_notes.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    try {
        console.log('--- Initiating Migration v5 ---');
        await pool.query(sql);
        console.log('--- Migration v5 Completed Successfully ---');
    } catch (err) {
        console.error('--- Migration v5 Failed ---');
        console.error(err);
    } finally {
        await pool.end();
    }
}

migrate();
