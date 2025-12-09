import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple hardcoded auth for now (you can expand to use DB)
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Verify token middleware
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

export default router;
