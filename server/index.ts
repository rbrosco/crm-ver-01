import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import { pool } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PORT_NUM = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;

async function ensureArchivedSupport() {
  try {
    await pool.query(
      'ALTER TABLE IF EXISTS "clients" ADD COLUMN IF NOT EXISTS "isArchived" boolean NOT NULL DEFAULT false;'
    );
  } catch (err) {
    console.error('Failed to ensure isArchived column on clients:', err);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM API is running' });
});

// Serve static files from dist folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath, { index: 'index.html' }));

// Fallback to index.html for client-side routing (must be last)
app.use((req, res, next) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
(async () => {
  await ensureArchivedSupport();

  app.listen(PORT_NUM, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT_NUM}`);
    console.log(`📁 Serving static files from dist/`);
    console.log(`🔌 API available at /api`);
  });
})();

// Graceful shutdown
process.on('SIGINT', () => {
  process.exit(0);
});
