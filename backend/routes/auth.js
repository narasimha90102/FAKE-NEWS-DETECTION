import express from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';

const router = express.Router();

// Simple password hash using SHA-256 (replace with bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'truthguard_salt').digest('hex');
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const resolvedUsername = username || name;

    if (!resolvedUsername || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username: resolvedUsername }] });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username or email already exists.' });
    }

    const passwordHash = hashPassword(password);
    const user = new User({ username: resolvedUsername, email, passwordHash });
    await user.save();

    const { passwordHash: _, ...safeUser } = user.toObject();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGUxMmFiY2RlZjAxMiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.signature";
    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const passwordHash = hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const { passwordHash: _, ...safeUser } = user.toObject();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGUxMmFiY2RlZjAxMiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.signature";
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/auth/user/:id  (update profile)
router.put('/user/:id', async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username, avatar },
      { new: true, select: '-passwordHash' }
    );
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
