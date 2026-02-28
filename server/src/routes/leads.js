import { Router } from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = Router();

// GET /api/leads - Fetch all leads
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        user: true, // Include the full user object
      },
    });
    res.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/leads/:id - Fetch a single lead by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (error) {
    console.error(`Failed to fetch lead with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST /api/leads - Create a new lead
router.post('/', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Check if a lead already exists for this user
    const existingLead = await prisma.lead.findUnique({
      where: { userId },
    });

    if (existingLead) {
      return res.status(409).json({ error: 'This user is already a lead' });
    }

    // Create the new lead
    const newLead = await prisma.lead.create({
      data: {
        userId: userId,
        status: 'New', // Default status
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Failed to create lead:', error);
    // Handle cases where the user ID does not exist
    if (error.code === 'P2003') {
      // Foreign key constraint failed
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT /api/leads/:id - Update a lead
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        user: true,
      },
    });
    res.json(updatedLead);
  } catch (error) {
    console.error(`Failed to update lead with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id - Delete a lead
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lead.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Failed to delete lead with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;
