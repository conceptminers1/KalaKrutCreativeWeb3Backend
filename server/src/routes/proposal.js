import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      include: { proposer: true },
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Get a single proposal by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { proposer: true },
    });
    if (proposal) {
      res.json(proposal);
    } else {
      res.status(404).json({ error: 'Proposal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// Create a new proposal
router.post('/', async (req, res) => {
  const { title, description, status, proposerId } = req.body;
  try {
    const newProposal = await prisma.proposal.create({
      data: {
        title,
        description,
        status,
        proposerId,
      },
      include: { proposer: true },
    });
    res.status(201).json(newProposal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// Update a proposal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: {
        title,
        description,
        status,
      },
      include: { proposer: true },
    });
    res.json(updatedProposal);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

// Delete a proposal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.proposal.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});

export default router;
