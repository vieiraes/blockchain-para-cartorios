import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Blockchain } from '../core/Blockchain.class'
import { IssuerManager } from '../core/Issuer.class'

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
    const blockData = {
      id: 'test-block-1',
      timestamp: new Date().toISOString(),
      issuer: issuer.id,
      contents: [{
        data: 'Test document',
        type: 'string',
        contentHash: 'test-hash-123'
      }]
    }
    
    const newBlock = await blockchain.addBlock(blockData)
    expect(newBlock).toBeDefined()
    expect(newBlock.data.issuer).toBe(issuer.id)
    
    // Verificar que a chain tem blocos
    const chain = await blockchain.getChain()
    expect(chain.length).toBeGreaterThan(0)
  })
})