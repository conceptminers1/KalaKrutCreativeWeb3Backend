import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all contracts
router.get('/', async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      include: { gig: true, initiator: true },
    });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// Get a single contract by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { gig: true, initiator: true },
    });
    if (contract) {
      res.json(contract);
    } else {
      res.status(404).json({ error: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

// Create a new contract
router.post('/', async (req, res) => {
  const { title, terms, status, gigId, initiatorId } = req.body;
  try {
    const newContract = await prisma.contract.create({
      data: {
        title,
        terms,
        status,
        gigId,
        initiatorId,
      },
      include: { gig: true, initiator: true },
    });
    res.status(201).json(newContract);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contract' });
  }
});

// Update a contract
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, terms, status } = req.body;
  try {
    const updatedContract = await prisma.contract.update({
      where: { id },
      data: {
        title,
        terms,
        status,
      },
      include: { gig: true, initiator: true },
    });
    res.json(updatedContract);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

// Delete a contract
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contract.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.status(500).json({ error: 'Failed to delete contract' });
  }
});

export default router;
