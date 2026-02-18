import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// POST /api/contract-factories - Create a new contract factory
router.post('/contract-factories', async (req, res) => {
  const { name, description, abi, bytecode } = req.body;

  if (!name || !abi || !bytecode) {
    return res.status(400).json({ error: 'Name, ABI, and bytecode are required' });
  }

  try {
    const newFactory = await prisma.contractFactory.create({
      data: {
        name,
        description,
        abi: JSON.stringify(abi), // Store ABI as a JSON string
        bytecode,
      },
    });
    res.status(201).json(newFactory);
  } catch (error) {
    console.error('Failed to create contract factory:', error);
    res.status(500).json({ error: 'Failed to create contract factory' });
  }
});

// GET /api/contract-factories - Fetch all contract factories
router.get('/contract-factories', async (req, res) => {
  try {
    const factories = await prisma.contractFactory.findMany({
      include: { deployedContracts: true }, // Include deployed contracts
    });
    res.json(factories);
  } catch (error) {
    console.error('Failed to fetch contract factories:', error);
    res.status(500).json({ error: 'Failed to fetch contract factories' });
  }
});

// POST /api/smart-contracts - Create a new smart contract
router.post('/smart-contracts', async (req, res) => {
  const { name, address, version, factoryId } = req.body;

  if (!name || !address || !version || !factoryId) {
    return res.status(400).json({ error: 'Name, address, version, and factoryId are required' });
  }

  try {
    const newContract = await prisma.smartContract.create({
      data: {
        name,
        address,
        version,
        factoryId,
      },
    });
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Failed to create smart contract:', error);
    res.status(500).json({ error: 'Failed to create smart contract' });
  }
});

// GET /api/smart-contracts - Fetch all smart contracts
router.get('/smart-contracts', async (req, res) => {
  try {
    const contracts = await prisma.smartContract.findMany();
    res.json(contracts);
  } catch (error) {
    console.error('Failed to fetch smart contracts:', error);
    res.status(500).json({ error: 'Failed to fetch smart contracts' });
  }
});

export default router;
