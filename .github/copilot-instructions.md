# AI Agent Instructions for Blockchain Cartório Project

## Project Overview
This is a blockchain-based digital certification system designed for Brazilian notary offices (cartórios). The system allows accredited notaries (Issuers) to register and validate documents on an immutable blockchain.

## Architecture & Components

### Core Components
- **Blockchain Core** (`src/core/Blockchain.class.ts`): Manages the blockchain operations
  - Uses PostgreSQL (via Prisma) for block storage
  - Implements cryptographic hashing for block/data integrity
  - Each block contains notary data with content hashes

- **Issuer Management** (`src/core/Issuer.class.ts`): Handles notary office authentication
  - Two-step accreditation process
  - Cryptographic key-pair based authentication
  - Maintains issuer state in PostgreSQL

### Data Flow
1. Notary offices are registered and accredited through `/issuers` endpoints
2. Accredited issuers can create new blocks via `/blockchain/blocks`
3. Each block contains cryptographically signed notary data
4. Block integrity is maintained through hash chaining

## Development Workflow

### Environment Setup
```bash
npm install  # Install dependencies
cp .env.example .env  # Create and configure environment
npm run dev  # Start development server on port 3434
```

### Database
- Uses Supabase PostgreSQL (configuration in `prisma/schema.prisma`)
- Models:
  - `blocks`: Stores blockchain data
  - `issuers`: Manages notary credentials

### Key Patterns

#### Block Creation
```typescript
// Example block data structure
const blockData = {
  id: string,
  timestamp: ISO8601,
  issuer: string,
  contents: [{
    data: any,
    type: string,
    contentHash: string
  }]
}
```

#### Error Handling
- Use type-safe error handling with TypeScript
- API errors return standard JSON response with error details
- Database operations are wrapped in transactions where atomic operations are needed

## Integration Points
- **Supabase**: Primary database (PostgreSQL)
- **REST API**: Main interface for external integrations
- **Prisma ORM**: Database access layer

## Testing & Validation
- Run API tests: `npm test`
- Validate block integrity: GET `/blockchain/blocks/:index`
- Verify issuer credentials: POST `/issuers/accreditation`

## Common Workflows

### Adding New Block Types
1. Update `src/types/blockchain.types.ts` with new content type
2. Implement validation in `Blockchain.class.ts`
3. Add corresponding controller methods
4. Update API documentation

### Issuer Management
1. Register issuer: POST `/issuers`
2. Complete accreditation: POST `/issuers/accreditation`
3. Verify status: GET `/issuers/:id`
