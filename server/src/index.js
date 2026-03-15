import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

console.log('--- All Environment Variables ---');
console.log(process.env);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

try {
  const envFileContents = fs.readFileSync(envPath, 'utf-8');
  console.log('--- .env File Contents ---');
  console.log(envFileContents);
} catch (error) {
  console.error('Could not read .env file:', error);
}

dotenv.config({ path: envPath });
import express from 'express';
import cors from 'cors';
import pkg from './generated/client/index.js';
const { PrismaClient } = pkg;
import leadsRouter from './routes/leads.js';
import smartContractsRouter from './routes/smartContracts.js';
import joinRequestRouter from './routes/joinRequest.js';
import gigRouter from './routes/gig.js';
import contractRouter from './routes/contract.js';
import proposalRouter from './routes/proposal.js';
import voteRouter from './routes/vote.js';
import eventRouter from './routes/event.js';
import eventTicketRouter from './routes/eventTicket.js';
import nftRouter from './routes/nft.js';
import escrowRouter from './routes/escrow.js';
import userRouter from './routes/user.js';
import transactionsRouter from './routes/transactions.js';
import emailRouter from './routes/email.js';

const app = express();
let prisma;

try {
  prisma = new PrismaClient();
} catch (e) {
  console.error('Failed to create Prisma Client:', e);
  process.exit(1);
}

const whitelist = [
  'https://9000-firebase-kalakrutcreativekg1-1769075240619.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev',
  'https://8080-firebase-kalakrutcreativekg1-1769075240619.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Middleware
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});
app.use(cors(corsOptions));
app.use(express.json());



// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api', smartContractsRouter);
app.use('/api/join-requests', joinRequestRouter);
app.use('/api/gigs', gigRouter);
app.use('/api/contracts', contractRouter);
app.use('/api/proposals', proposalRouter);
app.use('/api/votes', voteRouter);
app.use('/api/events', eventRouter);
app.use('/api/event-tickets', eventTicketRouter);
app.use('/api/nfts', nftRouter);
app.use('/api/escrows', escrowRouter);
app.use('/api/users', userRouter);
app.use('/api/transactions', transactionsRouter); // Newly added fiat transaction routes
app.use('/api/emails', emailRouter);


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
// Restarting nodemon
