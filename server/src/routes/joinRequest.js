
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const router = express.Router();

// --- PUBLIC ROUTE ---

// Create a new join request
router.post('/', async (req, res) => {
  try {
    const { email, name, walletAddress, bio, location, musicBrainzId } = req.body;

    // Check if a user or a join request with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingRequest = await prisma.joinRequest.findUnique({ where: { email } });

    if (existingUser || (existingRequest && existingRequest.status !== 'DENIED')) {
      return res.status(409).json({ message: 'Email already in use or pending review.' });
    }

    // If a denied request exists, just update it. Otherwise, create a new one.
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
    res.status(500).json({ message: 'Internal server error' });
  }
});


// --- ADMIN ROUTES (TODO: Secure these routes with admin-only middleware) ---

// Get all join requests (for admin dashboard)
router.get('/admin', async (req, res) => {
    try {
        const requests = await prisma.joinRequest.findMany({
            orderBy: {
                createdAt: 'desc', // Show newest first
            },
        });
        res.json(requests);
    } catch (error) {
        console.error('Failed to retrieve join requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Approve a join request
router.post('/admin/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        const joinRequest = await prisma.joinRequest.findUnique({
            where: { id },
        });

        if (!joinRequest || joinRequest.status !== 'PENDING') {
            return res.status(404).json({ message: 'Join request not found or already processed.' });
        }

        // --- Create a new User from the Join Request ---
        
        // For now, we'll generate a random temporary password. 
        // In a real app, you'd implement a "set your password" flow.
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = await prisma.user.create({
            data: {
                email: joinRequest.email,
                name: joinRequest.name,
                password: hashedPassword,
                walletAddress: joinRequest.walletAddress,
                role: 'USER', // Assign the default user role
                // Create an associated artist profile
                artistProfile: {
                    create: {
                        bio: joinRequest.bio,
                        location: joinRequest.location,
                        musicBrainzId: joinRequest.musicBrainzId,
                        verified: true, // Automatically verify approved artists
                    },
                },
            },
            include: {
                artistProfile: true, // Include the profile in the response
            },
        });

        // --- Update the join request status ---
        await prisma.joinRequest.update({
            where: { id },
            data: { status: 'APPROVED' },
        });

        // IMPORTANT: In a real-world scenario, you would now trigger an email
        // to the user with their temporary password and a link to log in.
        console.log(`User ${newUser.email} created with temporary password: ${tempPassword}`);

        res.status(201).json({
            message: 'User created successfully from join request.',
            user: newUser,
        });

    } catch (error) {
        // Handle potential errors, e.g., if the user email somehow already exists
        if (error.code === 'P2002') { // Prisma unique constraint violation
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }
        console.error('Failed to approve join request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Deny a join request
router.post('/admin/:id/deny', async (req, res) => {
    const { id } = req.params;
    try {
        const joinRequest = await prisma.joinRequest.findUnique({
            where: { id },
        });

        if (!joinRequest || joinRequest.status !== 'PENDING') {
            return res.status(404).json({ message: 'Join request not found or already processed.' });
        }

        await prisma.joinRequest.update({
            where: { id },
            data: { status: 'DENIED' },
        });

        res.json({ message: 'Join request denied.' });
    } catch (error) {
        console.error('Failed to deny join request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
