import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(user);
});

// Create a new user
router.post('/', async (req, res) => {
  const { email, name, password } = req.body;
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password, // Note: In a real app, you should hash the password
    },
  });
  res.json(newUser);
});

// Update a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      email,
      name,
    },
  });
  res.json(updatedUser);
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.json({ message: 'User deleted' });
});

export default router;
