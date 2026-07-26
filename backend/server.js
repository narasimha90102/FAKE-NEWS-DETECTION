import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import checksRoutes from './routes/checks.js';
import analyzeRoutes from './routes/analyze.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5500', '*'],
  credentials: true
}));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/checks', checksRoutes);
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TruthGuard API is running 🛡️' });
});

// ─── Catch-all: serve index.html for frontend routes ─────────────────────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Start server immediately (DB connects in background) ────────────────────
app.listen(PORT, () => {
  console.log(`🚀 TruthGuard server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Connect DB after server is already listening
connectDB().catch((err) => {
  console.warn('⚠️ MongoDB not connected — some features may be unavailable:', err.message);
});
