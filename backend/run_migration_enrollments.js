require('dotenv').config();
const { query } = require('./config/db');

async function run() {
  try {
    console.log('Creating enrollments table...');
    await query(`
      CREATE TABLE IF NOT EXISTS enrollments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          classroom_id INTEGER REFERENCES classrooms(id) ON DELETE CASCADE,
          UNIQUE (user_id, classroom_id)
      );
    `);
    
    try {
        console.log('Migrating data from classroom_members...');
        await query(`
          INSERT INTO enrollments (user_id, classroom_id)
          SELECT student_id, classroom_id FROM classroom_members
          ON CONFLICT DO NOTHING;
        `);
    } catch (e) {
        console.log('No classroom_members data to migrate or table missing.');
    }
    
    console.log('Successfully completed migration.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit(0);
  }
}
run();
