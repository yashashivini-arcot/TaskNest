const express = require('express');
const cors = require('cors');
const { query } = require('./config/db');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/classrooms', require('./routes/classrooms'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

// Serve frontend statically in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve the React app (Client-Side Routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 TaskNest Server is active on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  
  // Test DB Connection
  try {
    await query('SELECT NOW()');
    console.log('🔗 Database connection verified');
  } catch (err) {
    console.error('⚠️ Database connection failed on startup. Please ensure PostgreSQL is running.');
    console.error(`   Error details: ${err.message}`);
  }
});

server.on('error', (err) => {
  console.error('❌ Server startup error:', err);
});
// Trigger nodemon restart
