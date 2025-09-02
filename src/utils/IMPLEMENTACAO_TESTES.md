# Implementação de Testes com Vitest

Este documento descreve a implementação do framework de testes Vitest no projeto Blockchain para Cartórios.

## Estrutura de Testes

```
src/
├── core/                    # Classes principais
│   ├── Blockchain.class.ts
│   ├── Blockchain.class.test.ts
│   ├── Issuer.class.ts
│   └── Issuer.class.test.ts
├── controllers/             # Controladores
│   ├── Blockchain.controllers.ts
│   └── Blockchain.controllers.test.ts
├── integration/             # Testes de integração
│   └── blockchain-issuer.integration.test.ts
__mocks__/
├── prisma.ts               # Mock do cliente Prisma
└── setup.ts                # Setup global de mocks
```

## Tecnologias Utilizadas

- **Vitest**: Framework de testes rápido e moderno
- **TypeScript**: Tipagem estática para testes
- **Prisma Mock**: Para mockar o banco de dados nos testes

## Comandos Disponíveis

```bash
# Executar testes em modo watch (reexecuta ao salvar arquivos)
npm run test

# Executar testes uma única vez
npm run test:run

# Executar testes com relatório de cobertura
npm run test:coverage
```

## Estratégia de Testes

1. **Testes Unitários**: Testam classes e funções isoladamente
   - `Blockchain.class.test.ts`: Testa a lógica da blockchain
   - `Issuer.class.test.ts`: Testa a gestão de emissores

2. **Testes de Controladores**: Testam os endpoints REST
   - `Blockchain.controllers.test.ts`: Testa os endpoints da blockchain

3. **Testes de Integração**: Testam a interação entre diferentes componentes
   - `blockchain-issuer.integration.test.ts`: Testa a integração entre blockchain e emissores

## Mocks

Os mocks são utilizados para simular dependências externas como o banco de dados Prisma:

- `__mocks__/prisma.ts`: Mock do cliente Prisma
- `__mocks__/setup.ts`: Setup global de mocks

## Exemplo de Teste

```typescript
import { describe, it, expect } from 'vitest'
import { Blockchain } from './Blockchain.class'

describe('Blockchain', () => {
  it('should create a genesis block', async () => {
    const blockchain = new Blockchain()
    const chain = await blockchain.getChain()
    expect(chain).toHaveLength(1)
  })
})
```