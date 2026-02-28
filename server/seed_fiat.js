import pkg from './src/generated/client/index.js';
const { PrismaClient, TransactionType } = pkg;

const prisma = new PrismaClient();

const dummyTransactions = [
  {
    amount: 1500.00,
    currency: 'USD',
    status: 'COMPLETED',
    description: 'Artist Performance Fee - Summer Festival',
    type: TransactionType.EXPENSE,
    referenceId: 'PAY-8829102',
    notes: 'Paid via bank transfer on 2026-02-25'
  },
  {
    amount: 5000.00,
    currency: 'EUR',
    status: 'COMPLETED',
    description: 'Corporate Sponsorship - Tech Hub',
    type: TransactionType.INCOME,
    referenceId: 'INV-2026-001',
    notes: 'Q1 Sponsorship installment'
  },
  {
    amount: 250.50,
    currency: 'USD',
    status: 'PENDING',
    description: 'Equipment Rental Deposit',
    type: TransactionType.EXPENSE,
    referenceId: 'REF-99201',
    notes: 'Awaiting confirmation from vendor'
  },
  {
    amount: 1200.00,
    currency: 'GBP',
    status: 'FAILED',
    description: 'Ticket Sales Revenue - Batch A',
    type: TransactionType.INCOME,
    referenceId: 'STRIPE-ERR-04',
    notes: 'Gateway timeout during sync'
  }
];

async function seed() {
  console.log('--- Starting Fiat Transaction Seed ---');
  try {
    for (const data of dummyTransactions) {
      const transaction = await prisma.fiatTransaction.create({
        data
      });
      console.log(`✅ Inserted transaction: ${transaction.id} - ${transaction.description}`);
    }
    console.log('--- Seed completed successfully ---');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();