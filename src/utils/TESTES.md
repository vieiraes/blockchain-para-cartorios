# Testes do Projeto Blockchain

Este projeto utiliza **Vitest** como framework de testes, que é uma alternativa moderna e rápida ao Jest.

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
```

## Comandos de Teste

```bash
# Executar testes em modo watch (reexecuta ao salvar arquivos)
npm run test

# Executar testes uma única vez
npm run test:run

# Executar testes com relatório de cobertura
npm run test:coverage
```

## Tipos de Testes

1. **Testes Unitários**: Testam classes e funções isoladamente
2. **Testes de Integração**: Testam a interação entre diferentes componentes
3. **Testes de API**: Testam os endpoints REST (futuro)

## Tecnologias Utilizadas

- **Vitest**: Framework de testes rápido e moderno
- **TypeScript**: Tipagem estática para testes
- **Prisma Mock**: Para mockar o banco de dados (futuro)

## Exemplo de Teste

```typescript
import { describe, it, expect } from 'vitest'
import { Blockchain } from '../src/core/Blockchain.class'

describe('Blockchain', () => {
  it('should create a genesis block', async () => {
    const blockchain = new Blockchain()
    const chain = await blockchain.getChain()
    expect(chain).toHaveLength(1)
  })
})
```