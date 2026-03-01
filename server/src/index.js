import 'dotenv/config';
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
  origin: true,
  credentials: true,
};

// Middleware
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
app.use('/api', transactionsRouter); // Newly added fiat transaction routes


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