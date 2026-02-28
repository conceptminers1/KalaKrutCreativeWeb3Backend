import express from 'express';
import pkg from '../generated/client/index.js';
const { PrismaClient, TransactionType } = pkg;

const prisma = new PrismaClient();
const router = express.Router();

// Middleware for basic validation
const validateTransaction = (req, res, next) => {
  const { amount, currency, description, type } = req.body;
  if (!amount || !currency || !description || !type) {
    return res.status(400).json({ error: 'Missing required fields: amount, currency, description, type' });
  }
  if (isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: 'Amount must be a valid number.' });
  }
  if (!Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ error: `Invalid transaction type: ${type}` });
  }
  next();
};

/**
 * @swagger
 * /api/fiat-transactions:
 *   get:
 *     summary: Retrieve a list of all fiat transactions
 *     description: Fetches all fiat transactions from the database, ordered by most recent.
 *     tags:
 *       - Fiat Transactions
 *     responses:
 *       200:
 *         description: A list of fiat transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FiatTransaction'
 *       500:
 *         description: Server error.
 */
router.get('/fiat-transactions', async (req, res) => {
  try {
    const transactions = await prisma.fiatTransaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Failed to fetch fiat transactions:", error);
    res.status(500).json({ error: 'Failed to fetch fiat transactions' });
  }
});

/**
 * @swagger
 * /api/fiat-transactions:
 *   post:
 *     summary: Create a new fiat transaction
 *     description: Adds a new fiat transaction to the database. This endpoint will be used by payment gateways like PayPal or Stripe in the future.
 *     tags:
 *       - Fiat Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - description
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The transaction amount.
 *               currency:
 *                 type: string
 *                 description: The currency code (e.g., 'USD').
 *               description:
 *                 type: string
 *                 description: A brief description of the transaction.
 *               type:
 *                 $ref: '#/components/schemas/TransactionType'
 *               status:
 *                 $ref: '#/components/schemas/TransactionStatus'
 *               referenceId:
 *                 type: string
 *                 description: The external ID from a payment provider (e.g., PayPal transaction ID).
 *               notes:
 *                 type: string
 *                 description: Internal notes for the transaction.
 *               userId:
 *                 type: string
 *                 description: The ID of the user associated with this transaction.
 *     responses:
 *       201:
 *         description: The created fiat transaction.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiatTransaction'
 *       400:
 *         description: Bad request, invalid or missing data.
 *       500:
 *         description: Server error.
 */
router.post('/fiat-transactions', validateTransaction, async (req, res) => {
  try {
    const { amount, currency, description, type, status, referenceId, notes, userId } = req.body;

    const newTransaction = await prisma.fiatTransaction.create({
      data: {
        amount: parseFloat(amount),
        currency,
        description,
        type,
        status,
        referenceId,
        notes,
        userId,
      },
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Failed to create fiat transaction:", error);
    res.status(500).json({ error: 'Failed to create fiat transaction' });
  }
});

export default router;