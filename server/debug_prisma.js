import pkg from './src/generated/client/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function debugPrisma() {
  console.log('--- Prisma Client Debug ---');
  
  if (prisma.fiatTransaction) {
    console.log('✅ Success: prisma.fiatTransaction is defined.');
    try {
      const count = await prisma.fiatTransaction.count();
      console.log(`📊 Current record count: ${count}`);
    } catch (err) {
      console.error('❌ Error querying fiatTransaction:', err.message);
    }
  } else {
    console.error('❌ Error: fiatTransaction model is MISSING from the generated client.');
    console.log('Available models:', Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
  }

  await prisma.$disconnect();
  console.log('---------------------------');
}

debugPrisma().catch(async (e) => {
  console.error('💥 Fatal error in debug script:', e);
  await prisma.$disconnect();
  process.exit(1);
});