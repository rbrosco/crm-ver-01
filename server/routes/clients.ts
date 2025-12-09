import { Router } from 'express';
import { authenticateToken } from './auth';
import pool from '../db';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Client" ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Erro ao buscar clientes' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM "Client" WHERE "id" = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Erro ao buscar cliente' });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, country, macAddress, entryDate, subscriptionDays, isPaid } = req.body;

    const result = await pool.query(
      'INSERT INTO "Client" ("fullName", "phone", "country", "macAddress", "entryDate", "subscriptionDays", "isPaid") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [fullName, phone, country, macAddress, entryDate, subscriptionDays, isPaid || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, country, macAddress, entryDate, subscriptionDays, isPaid } = req.body;

    const result = await pool.query(
      'UPDATE "Client" SET "fullName" = $1, "phone" = $2, "country" = $3, "macAddress" = $4, "entryDate" = $5, "subscriptionDays" = $6, "isPaid" = $7 WHERE "id" = $8 RETURNING *',
      [fullName, phone, country, macAddress, entryDate, subscriptionDays, isPaid, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM "Client" WHERE "id" = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Erro ao excluir cliente' });
  }
});

// Bulk import
router.post('/import', async (req, res) => {
  try {
    const { clients } = req.body;

    if (!Array.isArray(clients)) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    const values = clients.map(client => [
      client.fullName,
      client.phone,
      client.country,
      client.macAddress,
      client.entryDate,
      client.subscriptionDays,
      client.isPaid || false
    ]);

    const query = `INSERT INTO "Client" ("fullName", "phone", "country", "macAddress", "entryDate", "subscriptionDays", "isPaid") VALUES ${values
      .map((_, i) => `(${values[i].map((_, j) => `$${i * values[i].length + j + 1}`).join(', ')})`)
      .join(', ')} ON CONFLICT DO NOTHING`;

    await pool.query(query, values.flat());

    res.json({ message: `${clients.length} clientes importados com sucesso` });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Erro ao importar clientes' });
  }
});

export default router;
