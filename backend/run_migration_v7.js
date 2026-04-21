const { query } = require('./config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  console.log('Running migration v7 (consolidate schema)...');
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'migration_v7_consolidate.sql'), 'utf8');
    // Split on semicolons, filter blanks, run each statement
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await query(stmt);
      console.log('✓', stmt.split('\n')[0].substring(0, 80));
    }
    console.log('\n✅ Migration v7 complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigration();
