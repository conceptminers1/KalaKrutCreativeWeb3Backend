import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const { name, gigId, contractAddress } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        gigId,
        contractAddress,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, gigId, contractAddress } = req.body;
  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        gigId,
        contractAddress,
      },
    });
    res.json(updatedEvent);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
