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
      findMany: vi.fn(),
      update: vi.fn()
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

  it('should accredit an issuer with valid hash', async () => {
    // Mock prisma.issuers.findUnique to return an issuer
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'test-id',
      name: 'Test Issuer',
      private_key_hash: 'valid-hash',
      is_accredited: false,
      created_at: new Date()
    });

    // Mock prisma.issuers.update to return updated issuer
    (prismaMock.default.issuers.update as jest.Mock).mockResolvedValueOnce({
      id: 'test-id',
      name: 'Test Issuer',
      private_key_hash: 'valid-hash',
      is_accredited: true,
      created_at: new Date()
    });

    const result = await issuerManager.accreditIssuer('test-id', 'valid-hash');
    expect(result).toBe(true);
  });

  it('should not accredit an issuer with invalid hash', async () => {
    // Mock prisma.issuers.findUnique to return an issuer
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'test-id',
      name: 'Test Issuer',
      private_key_hash: 'valid-hash',
      is_accredited: false,
      created_at: new Date()
    });

    const result = await issuerManager.accreditIssuer('test-id', 'invalid-hash');
    expect(result).toBe(false);
  });

  it('should throw error when accrediting non-existent issuer', async () => {
    // Mock prisma.issuers.findUnique to return null
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce(null);

    await expect(issuerManager.accreditIssuer('non-existent-id', 'any-hash'))
      .rejects
      .toThrow('Issuer not found');
  });

  it('should check if issuer is accredited', async () => {
    // Mock prisma.issuers.findUnique to return an accredited issuer
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'test-id',
      name: 'Test Issuer',
      private_key_hash: 'valid-hash',
      is_accredited: true,
      created_at: new Date()
    });

    const isAccredited = await issuerManager.isIssuerAccredited('test-id');
    expect(isAccredited).toBe(true);
  });

  it('should return false for non-accredited issuer', async () => {
    // Mock prisma.issuers.findUnique to return a non-accredited issuer
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'test-id',
      name: 'Test Issuer',
      private_key_hash: 'valid-hash',
      is_accredited: false,
      created_at: new Date()
    });

    const isAccredited = await issuerManager.isIssuerAccredited('test-id');
    expect(isAccredited).toBe(false);
  });

  it('should return false for non-existent issuer when checking accreditation', async () => {
    // Mock prisma.issuers.findUnique to return null
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const isAccredited = await issuerManager.isIssuerAccredited('non-existent-id');
    expect(isAccredited).toBe(false);
  });

  it('should retrieve an issuer by ID', async () => {
    const mockIssuer = {
      id: 'test-id',
      name: 'Test Issuer',
      private_key_hash: 'valid-hash',
      is_accredited: true,
      created_at: new Date()
    };

    // Mock prisma.issuers.findUnique to return an issuer
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce(mockIssuer);

    const issuer = await issuerManager.getIssuer('test-id');
    expect(issuer).toBeDefined();
    expect(issuer?.id).toBe('test-id');
    expect(issuer?.name).toBe('Test Issuer');
    expect(issuer?.isAccredited).toBe(true);
    // Ensure secretWords and privateKeyHash are not included
    expect(issuer).not.toHaveProperty('secretWords');
    expect(issuer).not.toHaveProperty('privateKeyHash');
  });

  it('should return null for non-existent issuer when retrieving by ID', async () => {
    // Mock prisma.issuers.findUnique to return null
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const issuer = await issuerManager.getIssuer('non-existent-id');
    expect(issuer).toBeNull();
  });

  it('should retrieve all issuers', async () => {
    const mockIssuers = [
      {
        id: 'test-id-1',
        name: 'Test Issuer 1',
        private_key_hash: 'valid-hash-1',
        is_accredited: true,
        created_at: new Date()
      },
      {
        id: 'test-id-2',
        name: 'Test Issuer 2',
        private_key_hash: 'valid-hash-2',
        is_accredited: false,
        created_at: new Date()
      }
    ];

    // Mock prisma.issuers.findMany to return issuers
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findMany as jest.Mock).mockResolvedValueOnce(mockIssuers);

    const issuers = await issuerManager.getAllIssuers();
    expect(issuers).toHaveLength(2);
    expect(issuers[0].id).toBe('test-id-1');
    expect(issuers[1].id).toBe('test-id-2');
    // Ensure secretWords and privateKeyHash are not included
    expect(issuers[0]).not.toHaveProperty('secretWords');
    expect(issuers[0]).not.toHaveProperty('privateKeyHash');
  });

  it('should return empty array when no issuers exist', async () => {
    // Mock prisma.issuers.findMany to return empty array
    const prismaMock = await import('../lib/prisma');
    (prismaMock.default.issuers.findMany as jest.Mock).mockResolvedValueOnce([]);

    const issuers = await issuerManager.getAllIssuers();
    expect(issuers).toHaveLength(0);
  });
})