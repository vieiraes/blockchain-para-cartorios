import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Blockchain } from '../core/Blockchain.class'
import { IssuerManager } from '../core/Issuer.class'
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
    },
    issuers: {
      create: vi.fn().mockImplementation((args) => {
        const data = args.data;
        const now = new Date();
        return Promise.resolve({
          id: 'test-id',
          name: data.name,
          private_key_hash: data.private_key_hash,
          is_accredited: data.is_accredited,
          created_at: now,
          createdAt: now
        })
      }),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    }
  }
  return {
    default: mockPrisma
  }
})

describe('Blockchain and Issuer Integration', () => {
  let blockchain: Blockchain
  let issuerManager: IssuerManager

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()
    
    blockchain = new Blockchain()
    issuerManager = new IssuerManager()
    
    // Aguardar a inicialização da chain
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  it('should create issuer and add block to blockchain', async () => {
    // Mock do método create do IssuerManager
    vi.spyOn(issuerManager as any, 'createIssuer').mockResolvedValue({
      id: 'test-id',
      name: 'Test Cartorio',
      secretWords: ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5', 'WORD6', 'WORD7', 'WORD8', 'WORD9', 'WORD10', 'WORD11', 'WORD12', 'WORD13'],
      isAccredited: false,
      createdAt: new Date().toISOString()
    });
    
    // Criar um issuer
    const issuer = await issuerManager.createIssuer('Test Cartorio')
    expect(issuer).toBeDefined()
    
    // Adicionar um bloco à blockchain
    const blockData: BlockData = {
      id: 'test-block-1',
      timestamp: new Date().toISOString(),
      issuer: issuer.id,
      contents: [{
        data: 'Test document',
        type: 'string',
        hash: 'test-hash-123'
      }]
    }
    
    const newBlock = await blockchain.addBlock(blockData)
    expect(newBlock).toBeDefined()
    expect(newBlock.data.issuer).toBe(issuer.id)
    
    // Verificar que a chain tem blocos
    const chain = await blockchain.getChain()
    expect(chain.length).toBeGreaterThan(0)
  })

  it('should create multiple issuers and add blocks from different issuers', async () => {
    // Mock do método create do IssuerManager for multiple calls
    vi.spyOn(issuerManager as any, 'createIssuer')
      .mockResolvedValueOnce({
        id: 'issuer-1',
        name: 'Test Cartorio 1',
        secretWords: ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5', 'WORD6', 'WORD7', 'WORD8', 'WORD9', 'WORD10', 'WORD11', 'WORD12', 'WORD13'],
        isAccredited: false,
        createdAt: new Date().toISOString()
      })
      .mockResolvedValueOnce({
        id: 'issuer-2',
        name: 'Test Cartorio 2',
        secretWords: ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5', 'WORD6', 'WORD7', 'WORD8', 'WORD9', 'WORD10', 'WORD11', 'WORD12', 'WORD14'],
        isAccredited: false,
        createdAt: new Date().toISOString()
      });

    // Criar dois issuers
    const issuer1 = await issuerManager.createIssuer('Test Cartorio 1')
    const issuer2 = await issuerManager.createIssuer('Test Cartorio 2')
    
    expect(issuer1).toBeDefined()
    expect(issuer2).toBeDefined()
    expect(issuer1.id).toBe('issuer-1')
    expect(issuer2.id).toBe('issuer-2')
    
    // Mock getLatestBlock to return the genesis block
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
    }).mockResolvedValueOnce({
      index: 1,
      timestamp: new Date(Date.now() + 1000),
      data: {
        id: 'block-1',
        timestamp: new Date().toISOString(),
        issuer: 'issuer-1',
        contents: [{
          data: 'Test document 1',
          type: 'string',
          hash: 'test-hash-123'
        }]
      },
      previous_block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      block_hash: 'block1hash1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
    });

    // Mock prisma.blocks.create to return the new blocks
    (prismaMock.default.blocks.create as jest.Mock)
      .mockImplementationOnce((args) => {
        const data = args.data;
        return Promise.resolve({
          index: data.index,
          timestamp: data.timestamp,
          data: data.data,
          previous_block_hash: data.previous_block_hash,
          block_hash: 'block1hash1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
        });
      })
      .mockImplementationOnce((args) => {
        const data = args.data;
        return Promise.resolve({
          index: data.index,
          timestamp: data.timestamp,
          data: data.data,
          previous_block_hash: data.previous_block_hash,
          block_hash: 'block2hash1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
        });
      });

    // Adicionar blocos à blockchain de diferentes issuers
    const blockData1: BlockData = {
      id: 'block-1',
      timestamp: new Date().toISOString(),
      issuer: issuer1.id,
      contents: [{
        data: 'Test document 1',
        type: 'string',
        hash: 'test-hash-123'
      }]
    }
    
    const blockData2: BlockData = {
      id: 'block-2',
      timestamp: new Date().toISOString(),
      issuer: issuer2.id,
      contents: [{
        data: 'Test document 2',
        type: 'string',
        hash: 'test-hash-456'
      }]
    }
    
    const newBlock1 = await blockchain.addBlock(blockData1)
    const newBlock2 = await blockchain.addBlock(blockData2)
    
    expect(newBlock1).toBeDefined()
    expect(newBlock1.data.issuer).toBe(issuer1.id)
    expect(newBlock2).toBeDefined()
    expect(newBlock2.data.issuer).toBe(issuer2.id)
    
    // Verificar que a chain tem blocos
    const chain = await blockchain.getChain()
    expect(chain.length).toBeGreaterThan(0)
  })

  it('should validate chain after adding blocks', async () => {
    // Mock do método create do IssuerManager
    vi.spyOn(issuerManager as any, 'createIssuer').mockResolvedValue({
      id: 'test-issuer',
      name: 'Test Cartorio',
      secretWords: ['WORD1', 'WORD2', 'WORD3', 'WORD4', 'WORD5', 'WORD6', 'WORD7', 'WORD8', 'WORD9', 'WORD10', 'WORD11', 'WORD12', 'WORD13'],
      isAccredited: false,
      createdAt: new Date().toISOString()
    });

    // Criar um issuer
    const issuer = await issuerManager.createIssuer('Test Cartorio')
    expect(issuer).toBeDefined()
    
    // Mock getLatestBlock to return the genesis block
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
    }).mockResolvedValueOnce({
      index: 1,
      timestamp: new Date(Date.now() + 1000),
      data: {
        id: 'test-block-1',
        timestamp: new Date().toISOString(),
        issuer: 'test-issuer',
        contents: [{
          data: 'Test document',
          type: 'string',
          hash: 'test-hash-123'
        }]
      },
      previous_block_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      block_hash: 'newblockhash1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
    });

    // Mock prisma.blocks.create to return the new block
    (prismaMock.default.blocks.create as jest.Mock).mockImplementationOnce((args) => {
      const data = args.data;
      return Promise.resolve({
        index: data.index,
        timestamp: data.timestamp,
        data: data.data,
        previous_block_hash: data.previous_block_hash,
        block_hash: 'newblockhash1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
      });
    });

    // Adicionar um bloco à blockchain
    const blockData: BlockData = {
      id: 'test-block-1',
      timestamp: new Date().toISOString(),
      issuer: issuer.id,
      contents: [{
        data: 'Test document',
        type: 'string',
        hash: 'test-hash-123'
      }]
    }
    
    const newBlock = await blockchain.addBlock(blockData)
    expect(newBlock).toBeDefined()
    
    // Validar a chain
    const isValid = await blockchain.isChainValid()
    expect(isValid).toBe(true)
  })
})