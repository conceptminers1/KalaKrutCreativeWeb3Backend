import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all votes
router.get('/', async (req, res) => {
  try {
    const votes = await prisma.vote.findMany({
      include: { proposal: true, voter: true },
    });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Get a single vote by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const vote = await prisma.vote.findUnique({
      where: { id },
      include: { proposal: true, voter: true },
    });
    if (vote) {
      res.json(vote);
    } else {
      res.status(404).json({ error: 'Vote not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vote' });
  }
});

// Create a new vote
router.post('/', async (req, res) => {
  const { proposalId, voterId, choice, votingPower } = req.body;
  try {
    const newVote = await prisma.vote.create({
      data: {
        proposalId,
        voterId,
        choice,
        votingPower,
      },
      include: { proposal: true, voter: true },
    });
    res.status(201).json(newVote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vote' });
  }
});

// This model does not have any updatable fields, so we do not include a PUT route.

// Delete a vote
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.vote.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Vote not found' });
    }
    res.status(500).json({ error: 'Failed to delete vote' });
  }
});

export default router;
