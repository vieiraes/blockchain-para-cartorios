import prisma from './src/lib/prisma';

async function main() {
  try {
    console.log('Checking database connection...');
    
    // Check if blocks table exists
    const blocksCount = await prisma.blocks.count();
    console.log(`blocks table exists with ${blocksCount} records`);
    
    // Check if issuers table exists
    const issuersCount = await prisma.issuers.count();
    console.log(`issuers table exists with ${issuersCount} records`);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();