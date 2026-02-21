
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import leadsRouter from './routes/leads.js';
import smartContractsRouter from './routes/smartContracts.js';
import joinRequestRouter from './routes/joinRequest.js';

const app = express();
let prisma;

try {
  prisma = new PrismaClient();
} catch (e) {
  console.error('Failed to create Prisma Client:', e);
  process.exit(1);
}

// A more robust CORS configuration for development
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // and requests from any localhost port
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api', smartContractsRouter);
app.use('/api/join-requests', joinRequestRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

// Start the server
const host = '0.0.0.0';
const port = process.env.PORT || 8081;

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
// Restarting nodemon