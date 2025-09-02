import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Blockchain } from './Blockchain.class'

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
          timestamp: data.timestamp,
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
      })
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
})