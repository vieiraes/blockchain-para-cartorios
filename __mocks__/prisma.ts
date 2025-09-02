// Mock do Prisma Client para testes
const mockPrismaClient = {
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
};

const PrismaClient = vi.fn(() => mockPrismaClient);

export default mockPrismaClient;

export { PrismaClient };