
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import leadsRouter from './routes/leads.js';
import smartContractsRouter from './routes/smartContracts.js'; // Import the new router

const app = express();
let prisma;

try {
  prisma = new PrismaClient();
} catch (e) {
  console.error('Failed to create Prisma Client:', e);
  process.exit(1);
}


// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api', smartContractsRouter); // Add the new router

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

// Start the server
const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected.');
  process.exit(0);
});
