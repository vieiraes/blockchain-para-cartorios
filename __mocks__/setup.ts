// Setup file para mocks globais
import { vi } from 'vitest'

// Mock do módulo prisma
vi.mock('../lib/prisma', () => {
  const mockPrisma = {
    blocks: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    },
    issuers: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    }
  }
  
  return {
    default: mockPrisma
  }
})