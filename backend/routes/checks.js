import express from 'express';
import { User } from '../models/User.js';
import { Check } from '../models/Check.js';

const router = express.Router();

// GET all checks for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const checks = await Check.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, checks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST a new check result
router.post('/', async (req, res) => {
  try {
    const { userId, text, verdict, score, summary, confidence, language, metrics } = req.body;
    const check = new Check({ userId, text, verdict, score, summary, confidence, language, metrics });
    await check.save();
    res.status(201).json({ success: true, check });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET trending / recent checks (public)
router.get('/trending', async (req, res) => {
  try {
    const trending = await Check.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('text verdict score summary createdAt language');
    res.json({ success: true, trending });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE a check by id
router.delete('/:id', async (req, res) => {
  try {
    await Check.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Check deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
