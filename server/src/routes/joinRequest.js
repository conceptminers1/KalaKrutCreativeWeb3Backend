import express from 'express';
import pkg from '../generated/client/index.js'; const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = express.Router();

// --- PUBLIC ROUTES ---

// Get a single join request by ID
// TODO: Secure this route to ensure only the user who created it or an admin can see it.
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await prisma.joinRequest.findUnique({
      where: { id },
    });
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ error: 'Join request not found' });
    }
  } catch (error) {
    console.error('Failed to fetch join request:', error);
    res.status(500).json({ error: 'Failed to fetch join request' });
  }
});


// Create a new join request or update a denied one
router.post('/', async (req, res) => {
  try {
    const { email, name, walletAddress, bio, location, musicBrainzId } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const existingRequest = await prisma.joinRequest.findUnique({ where: { email } });

    if (existingRequest && existingRequest.status === 'PENDING') {
        return res.status(409).json({ error: 'A join request with this email is already pending.' });
    }

    if (existingRequest && existingRequest.status === 'APPROVED') {
        return res.status(409).json({ error: 'A join request with this email has already been approved.' });
    }
    
    // If a denied request exists, update it to be PENDING again.
    if (existingRequest && existingRequest.status === 'DENIED') {
        const updatedRequest = await prisma.joinRequest.update({
            where: { email },
            data: {
                name,
                walletAddress,
                bio,
                location,
                musicBrainzId,
                status: 'PENDING', // Resubmit the request
                updatedAt: new Date(),
            }
        });
        return res.status(200).json(updatedRequest);
    } else {
        // Otherwise, create a new request.
        const newRequest = await prisma.joinRequest.create({
          data: {
            email,
            name,
            walletAddress,
            bio,
            location,
            musicBrainzId,
          },
        });
        return res.status(201).json(newRequest);
    }
  } catch (error) {
    console.error('Failed to create join request:', error);
    res.status(500).json({ error: 'Failed to create join request' });
  }
});

// Delete a join request
// TODO: Secure this so only the user who created it or an admin can delete it.
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.joinRequest.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') { // Prisma's record not found error
            return res.status(404).json({ error: 'Join request not found' });
        }
        console.error('Failed to delete join request:', error);
        res.status(500).json({ error: 'Failed to delete join request' });
    }
});


// --- ADMIN ROUTES ---
// TODO: Secure these routes with admin-only middleware

// Get all join requests
router.get('/admin/all', async (req, res) => {
    try {
        const requests = await prisma.joinRequest.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(requests || []);
    } catch (error) {
        console.error('Failed to retrieve join requests:', error);
        res.status(500).json({ error: 'Failed to retrieve join requests' });
    }
});

// Approve a join request
router.post('/admin/approve/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const joinRequest = await prisma.joinRequest.findUnique({
            where: { id },
        });

        if (!joinRequest || joinRequest.status !== 'PENDING') {
            return res.status(404).json({ error: 'Join request not found or has already been processed.' });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = await prisma.user.create({
            data: {
                email: joinRequest.email,
                name: joinRequest.name,
                password: hashedPassword,
                walletAddress: joinRequest.walletAddress,
                role: 'USER', 
                artistProfile: {
                    create: {
                        bio: joinRequest.bio,
                        location: joinRequest.location,
                        musicBrainzId: joinRequest.musicBrainzId,
                        verified: true,
                    },
                },
            },
            include: {
                artistProfile: true,
            },
        });

        await prisma.joinRequest.update({
            where: { id },
            data: { status: 'APPROVED' },
        });

        console.log(`User ${newUser.email} created with temporary password: ${tempPassword}`);

        res.status(201).json({
            message: 'User created successfully from join request.',
            user: newUser,
        });

    } catch (error) {
        if (error.code === 'P2002') { 
            return res.status(409).json({ error: 'A user with this email already exists.' });
        }
        console.error('Failed to approve join request:', error);
        res.status(500).json({ error: 'Failed to approve join request' });
    }
});

// Deny a join request
router.post('/admin/deny/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const joinRequest = await prisma.joinRequest.findUnique({
            where: { id },
        });

        if (!joinRequest || joinRequest.status !== 'PENDING') {
            return res.status(404).json({ error: 'Join request not found or has already been processed.' });
        }

        await prisma.joinRequest.update({
            where: { id },
            data: { status: 'DENIED' },
        });

        res.json({ message: 'Join request denied.' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Join request not found' });
        }
        console.error('Failed to deny join request:', error);
        res.status(500).json({ error: 'Failed to deny join request' });
    }
});


export default router;
