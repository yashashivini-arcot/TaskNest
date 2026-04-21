const { Client } = require('pg');
require('dotenv').config({ path: '../backend/.env' });

const migrate = async () => {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'siri2006',
        database: process.env.DB_NAME || 'tasknest'
    });

    try {
        await client.connect();
        console.log('Connected to database for migration...');
        await client.query('ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_url VARCHAR(500)');
        console.log('Successfully added file_url to submissions table.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await client.end();
    }
};

migrate();
