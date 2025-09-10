import { describe, it, expect, beforeEach, vi } from 'vitest'
import BlockchainController from './Blockchain.controllers'
import { Blockchain } from '../core/Blockchain.class'

// Mock da classe Blockchain
vi.mock('../core/Blockchain.class')

describe('BlockchainController', () => {
  let mockRequest: any
  let mockResponse: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    
    mockRequest = {
      body: {},
      params: {},
      query: {}
    }
    
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    }
  })

  it('should get blocks with pagination', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods
    const mockBlockchain = {
      getChain: vi.fn().mockResolvedValue([
        {
          index: 0,
          timestamp: new Date().toISOString(),
          data: { id: 'genesis', timestamp: new Date().toISOString(), issuer: 'system', contents: [] },
          previousBlockHash: '0',
          blockHash: 'genesis-hash'
        }
      ])
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.query = { page: '1', limit: '10' }
    
    await blockchainController.getBlocks(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should validate chain', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods
    const mockBlockchain = {
      isChainValid: vi.fn().mockResolvedValue(true)
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    await blockchainController.validateChain(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ isValid: true })
  })

  it('should add a new block', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods
    const mockBlockchain = {
      addBlock: vi.fn().mockResolvedValue({
        index: 1,
        timestamp: new Date().toISOString(),
        data: {
          id: 'test-block',
          timestamp: new Date().toISOString(),
          issuer: 'test-issuer',
          contents: []
        },
        previousBlockHash: 'previous-hash',
        blockHash: 'new-block-hash'
      })
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.body = {
      contents: [{ data: 'test data' }],
      issuer: 'test-issuer'
    }
    
    await blockchainController.addBlock(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should return 400 when contents or issuer are missing', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    mockRequest.body = {
      // Missing contents and issuer
    }
    
    await blockchainController.addBlock(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Contents and issuer are required' })
  })

  it('should return 400 when content validation fails', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    mockRequest.body = {
      contents: 'invalid-contents', // Should be an array
      issuer: 'test-issuer'
    }
    
    await blockchainController.addBlock(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Content must be an array' })
  })

  it('should return 400 when content hash mismatch occurs', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    mockRequest.body = {
      contents: [{ data: 'test data', contentHash: 'invalid-hash' }],
      issuer: 'test-issuer'
    }
    
    await blockchainController.addBlock(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Content hash mismatch' })
  })

  it('should return 400 when content hash mismatch occurs', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    mockRequest.body = {
      contents: [{ data: 'test data', contentHash: 'invalid-hash' }],
      issuer: 'test-issuer'
    }
    
    await blockchainController.addBlock(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Content hash mismatch' })
  })

  it('should return 500 when addBlock fails', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods to throw an error
    const mockBlockchain = {
      addBlock: vi.fn().mockRejectedValue(new Error('Database error'))
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.body = {
      contents: [{ data: 'test data' }],
      issuer: 'test-issuer'
    }
    
    await blockchainController.addBlock(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to add block' })
  })

  it('should get block by index', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods
    const mockBlockchain = {
      getBlockByIndex: vi.fn().mockResolvedValue({
        index: 5,
        timestamp: new Date().toISOString(),
        data: {
          id: 'block-5',
          timestamp: new Date().toISOString(),
          issuer: 'test-issuer',
          contents: []
        },
        previousBlockHash: 'previous-hash',
        blockHash: 'block-5-hash'
      })
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.params = { index: '5' }
    
    await blockchainController.getBlockByIndex(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should return 400 for invalid block index', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    mockRequest.params = { index: 'invalid' }
    
    await blockchainController.getBlockByIndex(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid block index' })
  })

  it('should return 404 when block is not found', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods to return null
    const mockBlockchain = {
      getBlockByIndex: vi.fn().mockResolvedValue(null)
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.params = { index: '999' }
    
    await blockchainController.getBlockByIndex(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Block not found' })
  })

  it('should return 500 when getBlockByIndex fails', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods to throw an error
    const mockBlockchain = {
      getBlockByIndex: vi.fn().mockRejectedValue(new Error('Database error'))
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.params = { index: '5' }
    
    await blockchainController.getBlockByIndex(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to get block' })
  })

  it('should get ledger with pagination', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods
    const mockBlockchain = {
      getChain: vi.fn().mockResolvedValue([
        {
          index: 0,
          timestamp: new Date().toISOString(),
          data: { id: 'genesis', timestamp: new Date().toISOString(), issuer: 'system', contents: [] },
          previousBlockHash: '0',
          blockHash: 'genesis-hash'
        },
        {
          index: 1,
          timestamp: new Date().toISOString(),
          data: { id: 'block-1', timestamp: new Date().toISOString(), issuer: 'issuer-1', contents: [] },
          previousBlockHash: 'genesis-hash',
          blockHash: 'block-1-hash'
        }
      ])
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.query = { page: '1', limit: '10' }
    
    await blockchainController.getLedger(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it('should return 500 when getLedger fails', async () => {
    // Import dinâmico para obter a instância singleton
    const blockchainModule = await import('./Blockchain.controllers')
    const blockchainController = blockchainModule.default
    
    // Mock the blockchain methods to throw an error
    const mockBlockchain = {
      getChain: vi.fn().mockRejectedValue(new Error('Database error'))
    }
    
    // @ts-ignore - Accessing private property for testing
    blockchainController.blockchain = mockBlockchain as any
    
    mockRequest.query = { page: '1', limit: '10' }
    
    await blockchainController.getLedger(mockRequest, mockResponse)
    
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to get ledger' })
  })
})