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
})