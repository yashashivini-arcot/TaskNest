require('dotenv').config();
const { query } = require('./backend/config/db');

async function run() {
  try {
    console.log('Adding UNIQUE constraint to users.email...');
    await query('ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);');
    console.log('Successfully completed.');
  } catch (err) {
    if (err.code === '42710') {
       console.log('Constraint already exists. Skipping.');
    } else {
       console.error('Migration error:', err);
    }
  } finally {
    process.exit(0);
  }
}
run();
