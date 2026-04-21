const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../config/db');

// Helper: sign JWT
const signToken = (payload, res) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('⚠️  JWT_SECRET is not set! Using insecure fallback. Set it in your .env file.');
  }
  jwt.sign(
    payload,
    secret || 'change_this_secret_in_production',
    { expiresIn: '24h' },
    (err, token) => {
      if (err) throw err;
      res._token = token;
    }
  );
  return res._token;
};

// @route   POST api/auth/register
// @desc    Register user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }
  if (!['student', 'faculty'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role. Must be student or faculty.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format.' });
  }

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, role]
    );

    const userData = newUser.rows[0];
    const secret = process.env.JWT_SECRET || 'change_this_secret_in_production';
    const token = jwt.sign(
      { user: { id: userData.id, role: userData.role } },
      secret,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required.' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    const userData = result.rows[0];
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET || 'change_this_secret_in_production';
    const token = jwt.sign(
      { user: { id: userData.id, role: userData.role } },
      secret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};

// @route   GET api/auth/students
// @desc    Get all students (protected)
exports.getStudents = async (req, res) => {
  try {
    const students = await query(
      'SELECT id, name, email FROM users WHERE role = $1 ORDER BY name ASC',
      ['student']
    );
    res.json(students.rows);
  } catch (err) {
    console.error('getStudents error:', err.message);
    res.status(500).json({ msg: 'Server error.' });
  }
};

// @route   POST api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required.' });

  try {
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    // Always respond the same way to prevent email enumeration
    const successMsg = 'If an account with that email exists, a reset link has been sent. Check your server logs (dev mode).';

    if (userResult.rows.length === 0) {
      return res.json({ msg: successMsg });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [hashedToken, expiryDate, email.toLowerCase().trim()]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    console.log('\n======================================================');
    console.log(`[DEV MODE] Password reset link for ${email}:`);
    console.log(resetLink);
    console.log('======================================================\n');

    res.json({ msg: successMsg });
  } catch (err) {
    console.error('forgotPassword error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};

// @route   POST api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ msg: 'Token and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const userResult = await query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Reset link is invalid or has expired. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    await query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [newHashedPassword, userResult.rows[0].id]
    );

    res.json({ msg: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('resetPassword error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};
