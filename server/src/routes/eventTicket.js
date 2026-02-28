import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all event tickets
router.get('/', async (req, res) => {
  try {
    const eventTickets = await prisma.eventTicket.findMany({
      include: { event: true, owner: true },
    });
    res.json(eventTickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event tickets' });
  }
});

// Get a single event ticket by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const eventTicket = await prisma.eventTicket.findUnique({
      where: { id },
      include: { event: true, owner: true },
    });
    if (eventTicket) {
      res.json(eventTicket);
    } else {
      res.status(404).json({ error: 'Event ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event ticket' });
  }
});

// Create a new event ticket
router.post('/', async (req, res) => {
  const { eventId, ownerId, tokenId, contractAddress } = req.body;
  try {
    const newEventTicket = await prisma.eventTicket.create({
      data: {
        eventId,
        ownerId,
        tokenId,
        contractAddress,
      },
      include: { event: true, owner: true },
    });
    res.status(201).json(newEventTicket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event ticket' });
  }
});

// This model does not have any updatable fields, so we do not include a PUT route.

// Delete an event ticket
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.eventTicket.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event ticket not found' });
    }
    res.status(500).json({ error: 'Failed to delete event ticket' });
  }
});

export default router;
