import { Router } from 'express';
import { authenticateToken } from './auth';
import { db } from '../db';
import { clients } from '../schema';
import { eq } from 'drizzle-orm';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all clients
router.get('/', async (req, res) => {
  try {
    const allClients = await db.select().from(clients).orderBy(clients.createdAt);
    res.json(allClients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Erro ao buscar clientes' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(clients).where(eq(clients.id, id));

    if (result.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Erro ao buscar cliente' });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, country, macAddress, entryDate, subscriptionDays, isPaid } = req.body;

    const result = await db.insert(clients).values({
      fullName,
      phone,
      country,
      macAddress,
      entryDate,
      subscriptionDays,
      isPaid: isPaid || false,
    }).returning();

    res.status(201).json(result[0]);
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

    const result = await db.update(clients)
      .set({
        fullName,
        phone,
        country,
        macAddress,
        entryDate,
        subscriptionDays,
        isPaid,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.delete(clients).where(eq(clients.id, id)).returning();

    if (result.length === 0) {
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
    const { clients: clientsData } = req.body;

    if (!Array.isArray(clientsData)) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    const values = clientsData.map(client => ({
      fullName: client.fullName,
      phone: client.phone,
      country: client.country,
      macAddress: client.macAddress,
      entryDate: client.entryDate,
      subscriptionDays: client.subscriptionDays,
      isPaid: client.isPaid || false,
    }));

    await db.insert(clients).values(values).onConflictDoNothing();

    res.json({ message: `${clientsData.length} clientes importados com sucesso` });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Erro ao importar clientes' });
  }
});

export default router;
