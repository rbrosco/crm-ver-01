import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

const router = Router();

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

// Login (authenticate against DB)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username e senha são obrigatórios' });
    }

    const result = await db.select().from(users).where(eq(users.username, username));

    if (!result || result.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

  // Change password (authenticated)
  router.post('/change-password', authenticateToken, async (req, res) => {
    try {
      const username = req.user?.username;
      const { currentPassword, newPassword } = req.body;

      if (!username) return res.status(400).json({ success: false, message: 'Usuário inválido' });
      if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Senha atual e nova são obrigatórias' });
      if (typeof newPassword !== 'string' || newPassword.length < 8) return res.status(400).json({ success: false, message: 'A nova senha deve ter ao menos 8 caracteres' });

      const result = await db.select().from(users).where(eq(users.username, username));
      if (!result || result.length === 0) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

      const user = result[0];
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(401).json({ success: false, message: 'Senha atual inválida' });

      const hashed = await bcrypt.hash(newPassword, 10);
      await db.update(users).set({ password: hashed }).where(eq(users.username, username));

      return res.json({ success: true, message: 'Senha atualizada com sucesso' });
    } catch (err) {
      console.error('Change password error:', err);
      return res.status(500).json({ success: false, message: 'Erro ao alterar senha' });
    }
  });

export default router;
