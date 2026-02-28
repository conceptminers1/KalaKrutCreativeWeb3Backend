import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Get all NFTs
router.get('/', async (req, res) => {
  try {
    const nfts = await prisma.nFT.findMany({
      include: { owner: true },
    });
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Get a single NFT by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const nft = await prisma.nFT.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (nft) {
      res.json(nft);
    } else {
      res.status(404).json({ error: 'NFT not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NFT' });
  }
});

// Create a new NFT
router.post('/', async (req, res) => {
  const { ownerId, tokenId, contractAddress, metadataUrl } = req.body;
  try {
    const newNFT = await prisma.nFT.create({
      data: {
        ownerId,
        tokenId,
        contractAddress,
        metadataUrl,
      },
      include: { owner: true },
    });
    res.status(201).json(newNFT);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NFT' });
  }
});

// Update an NFT (e.g., transfer ownership)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { ownerId, metadataUrl } = req.body; // Only allow updating owner and metadata
  try {
    const updatedNFT = await prisma.nFT.update({
      where: { id },
      data: {
        ownerId,
        metadataUrl,
      },
      include: { owner: true },
    });
    res.json(updatedNFT);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'NFT not found' });
    }
    res.status(500).json({ error: 'Failed to update NFT' });
  }
});

// Delete an NFT
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.nFT.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'NFT not found' });
    }
    res.status(500).json({ error: 'Failed to delete NFT' });
  }
});

export default router;
