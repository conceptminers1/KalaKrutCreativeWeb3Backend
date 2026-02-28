import { Router } from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const router = Router();

// --- ContractFactory Routes ---

// Get all contract factories
router.get('/contract-factories', async (req, res) => {
  try {
    const factories = await prisma.contractFactory.findMany({
      include: { deployedContracts: true },
    });
    res.json(factories.map(f => ({...f, abi: JSON.parse(f.abi)})));
  } catch (error) {
    console.error('Failed to fetch contract factories:', error);
    res.status(500).json({ error: 'Failed to fetch contract factories' });
  }
});

// Get a single contract factory by ID
router.get('/contract-factories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const factory = await prisma.contractFactory.findUnique({
      where: { id },
      include: { deployedContracts: true },
    });
    if (factory) {
      res.json({...factory, abi: JSON.parse(factory.abi)});
    } else {
      res.status(404).json({ error: 'Contract factory not found' });
    }
  } catch (error) {
    console.error('Failed to fetch contract factory:', error);
    res.status(500).json({ error: 'Failed to fetch contract factory' });
  }
});

// Create a new contract factory
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
        abi: JSON.stringify(abi),
        bytecode,
      },
    });
    res.status(201).json({...newFactory, abi: JSON.parse(newFactory.abi)});
  } catch (error) {
    console.error('Failed to create contract factory:', error);
    res.status(500).json({ error: 'Failed to create contract factory' });
  }
});

// Update a contract factory
router.put('/contract-factories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body; // Only name and description can be updated
  try {
    const updatedFactory = await prisma.contractFactory.update({
      where: { id },
      data: { name, description },
    });
    res.json({...updatedFactory, abi: JSON.parse(updatedFactory.abi)});
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contract factory not found' });
    }
    console.error('Failed to update contract factory:', error);
    res.status(500).json({ error: 'Failed to update contract factory' });
  }
});

// Delete a contract factory
router.delete('/contract-factories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contractFactory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contract factory not found' });
    }
    console.error('Failed to delete contract factory:', error);
    res.status(500).json({ error: 'Failed to delete contract factory' });
  }
});


// --- SmartContract Routes ---

// Get all smart contracts
router.get('/smart-contracts', async (req, res) => {
  try {
    const contracts = await prisma.smartContract.findMany({
      include: { factory: true },
    });
    res.json(contracts);
  } catch (error) {
    console.error('Failed to fetch smart contracts:', error);
    res.status(500).json({ error: 'Failed to fetch smart contracts' });
  }
});

// Get a single smart contract by ID
router.get('/smart-contracts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await prisma.smartContract.findUnique({
      where: { id },
      include: { factory: true },
    });
    if (contract) {
      res.json(contract);
    } else {
      res.status(404).json({ error: 'Smart contract not found' });
    }
  } catch (error) {
    console.error('Failed to fetch smart contract:', error);
    res.status(500).json({ error: 'Failed to fetch smart contract' });
  }
});

// Create a new smart contract instance
router.post('/smart-contracts', async (req, res) => {
  const { name, address, version, factoryId } = req.body;

  if (!name || !address || !version || !factoryId) {
    return res.status(400).json({ error: 'Name, address, version, and factoryId are required' });
  }

  try {
    const newContract = await prisma.smartContract.create({
      data: { name, address, version, factoryId },
      include: { factory: true },
    });
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Failed to create smart contract:', error);
    res.status(500).json({ error: 'Failed to create smart contract' });
  }
});

// Update a smart contract
router.put('/smart-contracts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, version } = req.body; // Only name and version can be updated
  try {
    const updatedContract = await prisma.smartContract.update({
      where: { id },
      data: { name, version },
      include: { factory: true },
    });
    res.json(updatedContract);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Smart contract not found' });
    }
    console.error('Failed to update smart contract:', error);
    res.status(500).json({ error: 'Failed to update smart contract' });
  }
});

// Delete a smart contract
router.delete('/smart-contracts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.smartContract.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Smart contract not found' });
    }
    console.error('Failed to delete smart contract:', error);
    res.status(500).json({ error: 'Failed to delete smart contract' });
  }
});

export default router;
