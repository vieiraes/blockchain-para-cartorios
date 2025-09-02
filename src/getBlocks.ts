import prisma from './lib/prisma';
import { Block } from './types/blockchain.types';

async function getBlocks() {
  try {
    const blocks = await prisma.blocks.findMany({ 
      orderBy: { index: 'asc' } 
    });
    
    console.log(`Found ${blocks.length} blocks in the database:`);
    console.log(JSON.stringify(blocks, null, 2));
  } catch (error) {
    console.error('Error fetching blocks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getBlocks();