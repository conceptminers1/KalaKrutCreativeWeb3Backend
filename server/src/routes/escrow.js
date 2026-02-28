import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all escrow contracts
router.get('/', async (req, res) => {
  try {
    const escrowContracts = await prisma.escrowContract.findMany({
      include: { contract: true },
    });
    res.json(escrowContracts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch escrow contracts' });
  }
});

// Get a single escrow contract by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const escrowContract = await prisma.escrowContract.findUnique({
      where: { id },
      include: { contract: true },
    });
    if (escrowContract) {
      res.json(escrowContract);
    } else {
      res.status(404).json({ error: 'Escrow contract not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch escrow contract' });
  }
});

// Create a new escrow contract
router.post('/', async (req, res) => {
  const { contractId, escrowAddress, status, amount } = req.body;
  try {
    const newEscrowContract = await prisma.escrowContract.create({
      data: {
        contractId,
        escrowAddress,
        status,
        amount,
      },
      include: { contract: true },
    });
    res.status(201).json(newEscrowContract);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create escrow contract' });
  }
});

// Update an escrow contract
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, amount } = req.body;
  try {
    const updatedEscrowContract = await prisma.escrowContract.update({
      where: { id },
      data: {
        status,
        amount,
      },
      include: { contract: true },
    });
    res.json(updatedEscrowContract);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Escrow contract not found' });
    }
    res.status(500).json({ error: 'Failed to update escrow contract' });
  }
});

// Delete an escrow contract
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.escrowContract.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Escrow contract not found' });
    }
    res.status(500).json({ error: 'Failed to delete escrow contract' });
  }
});

export default router;
