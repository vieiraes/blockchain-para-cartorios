import { describe, it, expect, beforeEach, vi } from 'vitest'
import { IssuerManager } from './Issuer.class'

// Mock do Prisma diretamente no teste
vi.mock('../lib/prisma', () => {
  const mockPrisma = {
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
      findMany: vi.fn()
    }
  }
  return {
    default: mockPrisma
  }
})

describe('IssuerManager', () => {
  let issuerManager: IssuerManager

  beforeEach(() => {
    issuerManager = new IssuerManager()
  })

  it('should create an issuer with secret words', async () => {
    const issuer = await issuerManager.createIssuer('Test Cartorio')
    
    expect(issuer).toBeDefined()
    expect(issuer.name).toBe('Test Cartorio')
    expect(issuer.secretWords).toHaveLength(13)
    expect(issuer.id).toBeDefined()
  })

  it('should generate secret words in uppercase', async () => {
    const issuer = await issuerManager.createIssuer('Test Cartorio')
    
    issuer.secretWords.forEach(word => {
      expect(word).toBe(word.toUpperCase())
    })
  })

  it('should generate different secret words for each issuer', async () => {
    const issuer1 = await issuerManager.createIssuer('Test Cartorio 1')
    const issuer2 = await issuerManager.createIssuer('Test Cartorio 2')
    
    expect(issuer1.secretWords).not.toEqual(issuer2.secretWords)
  })
})