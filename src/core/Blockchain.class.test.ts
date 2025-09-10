import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Blockchain } from './Blockchain.class'
import { BlockData } from '../types/blockchain.types'

// Mock do Prisma
vi.mock('../lib/prisma', () => {
  const mockPrisma = {
    blocks: {
      findUnique: vi.fn().mockImplementation((args) => {
        // Se for buscar o bloco com index 0, retorna o genesis block
        if (args.where.index === 0) {
          return Promise.resolve({
            index: 0,
            timestamp: new Date(),
            data: { 
              id: 'genesis', 
              timestamp: new Date().toISOString(), 
              issuer: 'system', 
              contents: [] 
            },
            previous_block_hash: '0',
            block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
          });
        }
        return Promise.resolve(null);
      }),
      findFirst: vi.fn().mockImplementation((args) => {
        // Se for ordenação por index desc, retorna o genesis block
        if (args.orderBy && args.orderBy.index === 'desc') {
          return Promise.resolve({
            index: 0,
            timestamp: new Date(),
            data: { 
              id: 'genesis', 
              timestamp: new Date().toISOString(), 
              issuer: 'system', 
              contents: [] 
            },
            previous_block_hash: '0',
            block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
          });
        }
        return Promise.resolve(null);
      }),
      create: vi.fn().mockImplementation((args) => {
        const data = args.data;
        // Gerar um hash SHA256 válido
        const blockHash = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
        return Promise.resolve({
          index: data.index,
          timestamp: new Date(data.timestamp), // Convert to Date object
          data: data.data,
          previous_block_hash: data.previous_block_hash,
          block_hash: blockHash
        });
      }),
      findMany: vi.fn().mockImplementation((args) => {
        // Se for ordenação por index asc, retorna apenas o genesis block
        if (args.orderBy && args.orderBy.index === 'asc') {
          return Promise.resolve([{
            index: 0,
            timestamp: new Date(),
            data: { 
              id: 'genesis', 
              timestamp: new Date().toISOString(), 
              issuer: 'system', 
              contents: [] 
            },
            previous_block_hash: '0',
            block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
          }]);
        }
        return Promise.resolve([]);
      }),
      update: vi.fn()
    }
  }
  return {
    default: mockPrisma
  }
})

describe('Blockchain', () => {
  let blockchain: Blockchain

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Criar uma nova instância para cada teste
    blockchain = new Blockchain()
    // Aguardar a inicialização da chain
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  it('should create a genesis block', async () => {
    const chain = await blockchain.getChain()
    expect(chain).toHaveLength(1)
    expect(chain[0].index).toBe(0)
    expect(chain[0].previousBlockHash).toBe('0')
  })

  it('should calculate block hash correctly', async () => {
    const latestBlock = await blockchain.getLatestBlock()
    expect(latestBlock).toBeDefined()
    expect(latestBlock?.blockHash).toMatch(/^[a-f0-9]{64}$/) // Hash SHA256
  })

  it('should add a new block to the blockchain', async () => {
    // First, mock getLatestBlock to return the genesis block
    const mockGenesisBlock = {
      index: 0,
      timestamp: new Date().toISOString(),
      data: {
        id: 'genesis',
        timestamp: new Date().toISOString(),
        issuer: 'system',
        contents: []
      },
      previousBlockHash: '0',
      blockHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    };

    // Mock the prisma.blocks.findFirst to return the genesis block
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findFirst as jest.Mock).mockResolvedValueOnce({
      index: 0,
      timestamp: new Date(),
      data: {
        id: 'genesis',
        timestamp: new Date().toISOString(),
        issuer: 'system',
        contents: []
      },
      previous_block_hash: '0',
      block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    });

    // Mock prisma.blocks.create to return the new block
    (prismaMock.default.blocks.create as jest.Mock).mockImplementationOnce((args) => {
      const data = args.data;
      return Promise.resolve({
        index: data.index,
        timestamp: new Date(data.timestamp), // Convert to Date object
        data: data.data,
        previous_block_hash: data.previous_block_hash,
        block_hash: 'newblockhash1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
      });
    });

    const blockData: BlockData = {
      id: 'test-block-1',
      timestamp: new Date().toISOString(),
      issuer: 'test-issuer',
      contents: [{
        data: 'Test document',
        type: 'string',
        hash: 'test-hash-123'
      }]
    };

    const newBlock = await blockchain.addBlock(blockData);
    
    expect(newBlock).toBeDefined();
    expect(newBlock.index).toBe(1);
    expect(newBlock.data.id).toBe('test-block-1');
    expect(newBlock.previousBlockHash).toBe('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
  });

  it('should validate a valid chain', async () => {
    // Import the createHash function to calculate the correct hashes
    const { createHash } = await import('crypto');
    
    // Calculate the correct hash for the genesis block
    const genesisBlockData = {
      index: 0,
      previousBlockHash: '0',
      timestamp: new Date().toISOString(),
      data: {
        id: 'genesis',
        timestamp: new Date().toISOString(),
        issuer: 'system',
        contents: []
      }
    };
    
    const genesisBlockHash = createHash('sha256')
      .update(genesisBlockData.index + genesisBlockData.previousBlockHash + genesisBlockData.timestamp + JSON.stringify(genesisBlockData.data))
      .digest('hex');
    
    // Calculate the correct hash for the second block
    const secondBlockData = {
      index: 1,
      previousBlockHash: genesisBlockHash,
      timestamp: new Date(Date.now() + 1000).toISOString(), // 1 second later
      data: {
        id: 'block-1',
        timestamp: new Date().toISOString(),
        issuer: 'issuer-1',
        contents: []
      }
    };
    
    const secondBlockHash = createHash('sha256')
      .update(secondBlockData.index + secondBlockData.previousBlockHash + secondBlockData.timestamp + JSON.stringify(secondBlockData.data))
      .digest('hex');

    // Mock prisma.blocks.findMany to return a valid chain
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findMany as jest.Mock).mockResolvedValueOnce([
      {
        index: 0,
        timestamp: new Date(),
        data: {
          id: 'genesis',
          timestamp: new Date().toISOString(),
          issuer: 'system',
          contents: []
        },
        previous_block_hash: '0',
        block_hash: genesisBlockHash
      },
      {
        index: 1,
        timestamp: new Date(Date.now() + 1000), // 1 second later
        data: {
          id: 'block-1',
          timestamp: new Date().toISOString(),
          issuer: 'issuer-1',
          contents: []
        },
        previous_block_hash: genesisBlockHash,
        block_hash: secondBlockHash
      }
    ]);

    const isValid = await blockchain.isChainValid();
    expect(isValid).toBe(true);
  });

  it('should detect invalid chain with hash mismatch', async () => {
    // Mock console.error to prevent log output during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock prisma.blocks.findMany to return an invalid chain (hash mismatch)
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findMany as jest.Mock).mockResolvedValueOnce([
      {
        index: 0,
        timestamp: new Date(),
        data: {
          id: 'genesis',
          timestamp: new Date().toISOString(),
          issuer: 'system',
          contents: []
        },
        previous_block_hash: '0',
        block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
      },
      {
        index: 1,
        timestamp: new Date(Date.now() + 1000), // 1 second later
        data: {
          id: 'block-1',
          timestamp: new Date().toISOString(),
          issuer: 'issuer-1',
          contents: []
        },
        previous_block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        block_hash: 'invalid-hash' // This will not match the calculated hash
      }
    ]);

    const isValid = await blockchain.isChainValid();
    expect(isValid).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Block 1 hash is invalid.');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should detect chain with broken link', async () => {
    // Import the createHash function to calculate the correct hashes
    const { createHash } = await import('crypto');
    
    // Use consistent timestamps
    const genesisTimestamp = new Date().toISOString();
    const secondBlockTimestamp = new Date(Date.now() + 1000).toISOString();
    
    // Calculate the correct hash for the genesis block
    const genesisBlockData = {
      index: 0,
      previousBlockHash: '0',
      timestamp: genesisTimestamp,
      data: {
        id: 'genesis',
        timestamp: new Date().toISOString(),
        issuer: 'system',
        contents: []
      }
    };
    
    const genesisBlockHash = createHash('sha256')
      .update(genesisBlockData.index + genesisBlockData.previousBlockHash + genesisBlockData.timestamp + JSON.stringify(genesisBlockData.data))
      .digest('hex');
    
    // Calculate the correct hash for the second block (but with broken link)
    // We need to calculate the hash with the BROKEN previous hash to make it valid
    const secondBlockDataWithBrokenLink = {
      index: 1,
      previousBlockHash: 'broken-link-hash', // This is the broken link
      timestamp: secondBlockTimestamp,
      data: {
        id: 'block-1',
        timestamp: new Date().toISOString(),
        issuer: 'issuer-1',
        contents: []
      }
    };
    
    const secondBlockHashWithBrokenLink = createHash('sha256')
      .update(secondBlockDataWithBrokenLink.index + secondBlockDataWithBrokenLink.previousBlockHash + secondBlockDataWithBrokenLink.timestamp + JSON.stringify(secondBlockDataWithBrokenLink.data))
      .digest('hex');

    // Mock console.error to prevent log output during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock prisma.blocks.findMany to return an invalid chain (broken link)
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findMany as jest.Mock).mockResolvedValueOnce([
      {
        index: 0,
        timestamp: new Date(genesisTimestamp), // Use the same timestamp
        data: {
          id: 'genesis',
          timestamp: new Date().toISOString(),
          issuer: 'system',
          contents: []
        },
        previous_block_hash: '0',
        block_hash: genesisBlockHash
      },
      {
        index: 1,
        timestamp: new Date(secondBlockTimestamp), // Use the same timestamp
        data: {
          id: 'block-1',
          timestamp: new Date().toISOString(),
          issuer: 'issuer-1',
          contents: []
        },
        previous_block_hash: 'broken-link-hash', // This doesn't match the previous block's hash
        block_hash: secondBlockHashWithBrokenLink // But the hash is calculated with the broken link, so it's valid
      }
    ]);

    const isValid = await blockchain.isChainValid();
    expect(isValid).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Chain link broken at block 1.');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should detect chain with invalid timestamp', async () => {
    // Import the createHash function to calculate the correct hashes
    const { createHash } = await import('crypto');
    
    // Use consistent timestamps
    const genesisTimestamp = new Date().toISOString();
    const secondBlockTimestamp = new Date(Date.now() - 10000).toISOString(); // 10 seconds earlier
    
    // Calculate the correct hash for the genesis block (with past timestamp)
    const genesisBlockData = {
      index: 0,
      previousBlockHash: '0',
      timestamp: genesisTimestamp,
      data: {
        id: 'genesis',
        timestamp: new Date().toISOString(),
        issuer: 'system',
        contents: []
      }
    };
    
    const genesisBlockHash = createHash('sha256')
      .update(genesisBlockData.index + genesisBlockData.previousBlockHash + genesisBlockData.timestamp + JSON.stringify(genesisBlockData.data))
      .digest('hex');
    
    // Calculate the correct hash for the second block (with even earlier timestamp)
    const secondBlockData = {
      index: 1,
      previousBlockHash: genesisBlockHash,
      timestamp: secondBlockTimestamp,
      data: {
        id: 'block-1',
        timestamp: new Date().toISOString(),
        issuer: 'issuer-1',
        contents: []
      }
    };
    
    const secondBlockHash = createHash('sha256')
      .update(secondBlockData.index + secondBlockData.previousBlockHash + secondBlockData.timestamp + JSON.stringify(secondBlockData.data))
      .digest('hex');

    // Mock console.error to prevent log output during test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock prisma.blocks.findMany to return an invalid chain (invalid timestamp)
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findMany as jest.Mock).mockResolvedValueOnce([
      {
        index: 0,
        timestamp: new Date(genesisTimestamp), // Use the same timestamp
        data: {
          id: 'genesis',
          timestamp: new Date().toISOString(),
          issuer: 'system',
          contents: []
        },
        previous_block_hash: '0',
        block_hash: genesisBlockHash
      },
      {
        index: 1,
        timestamp: new Date(secondBlockTimestamp), // Use the same timestamp
        data: {
          id: 'block-1',
          timestamp: new Date().toISOString(),
          issuer: 'issuer-1',
          contents: []
        },
        previous_block_hash: genesisBlockHash,
        block_hash: secondBlockHash
      }
    ]);

    const isValid = await blockchain.isChainValid();
    expect(isValid).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid timestamp at block 1.');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should retrieve a block by index', async () => {
    // Mock prisma.blocks.findUnique to return a specific block
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findUnique as jest.Mock).mockImplementation((args) => {
      if (args.where.index === 1) {
        return Promise.resolve({
          index: 1,
          timestamp: new Date(),
          data: {
            id: 'block-1',
            timestamp: new Date().toISOString(),
            issuer: 'issuer-1',
            contents: []
          },
          previous_block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
          block_hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        });
      }
      return Promise.resolve(null);
    });

    const block = await blockchain.getBlockByIndex(1);
    expect(block).toBeDefined();
    expect(block?.index).toBe(1);
    expect(block?.data.id).toBe('block-1');
  });

  it('should return null for non-existent block', async () => {
    // Mock prisma.blocks.findUnique to return null
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findUnique as jest.Mock).mockResolvedValue(null);

    const block = await blockchain.getBlockByIndex(999);
    expect(block).toBeNull();
  });

  it('should retrieve the complete chain', async () => {
    // Mock prisma.blocks.findMany to return multiple blocks
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.blocks.findMany as jest.Mock).mockResolvedValueOnce([
      {
        index: 0,
        timestamp: new Date(),
        data: {
          id: 'genesis',
          timestamp: new Date().toISOString(),
          issuer: 'system',
          contents: []
        },
        previous_block_hash: '0',
        block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
      },
      {
        index: 1,
        timestamp: new Date(Date.now() + 1000),
        data: {
          id: 'block-1',
          timestamp: new Date().toISOString(),
          issuer: 'issuer-1',
          contents: []
        },
        previous_block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        block_hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      }
    ]);

    const chain = await blockchain.getChain();
    expect(chain).toHaveLength(2);
    expect(chain[0].index).toBe(0);
    expect(chain[1].index).toBe(1);
    expect(chain[0].index).toBeLessThan(chain[1].index); // Check ordering
  });
})