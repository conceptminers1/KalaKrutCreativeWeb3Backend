import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await prisma.gig.findMany({
      include: { artist: true, venue: true },
    });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Get a single gig by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const gig = await prisma.gig.findUnique({
      where: { id },
      include: { artist: true, venue: true },
    });
    if (gig) {
      res.json(gig);
    } else {
      res.status(404).json({ error: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gig' });
  }
});

// Create a new gig
router.post('/', async (req, res) => {
  const { title, description, date, status, artistId, venueId } = req.body;
  try {
    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        date: new Date(date),
        status,
        artistId,
        venueId,
      },
      include: { artist: true, venue: true },
    });
    res.status(201).json(newGig);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create gig' });
  }
});

// Update a gig
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date, status, artistId, venueId } = req.body;
  try {
    const updatedGig = await prisma.gig.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        status,
        artistId,
        venueId,
      },
      include: { artist: true, venue: true },
    });
    res.json(updatedGig);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.status(500).json({ error: 'Failed to update gig' });
  }
});

// Delete a gig
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.gig.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.status(500).json({ error: 'Failed to delete gig' });
  }
});

export default router;
