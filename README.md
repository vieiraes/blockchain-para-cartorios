# Blockchain JavaScript

Uma implementação simplificada de blockchain em TypeScript/Node.js que roda em memória.

## Features

- Blockchain em memória
- Criação de blocos com hash SHA-256
- Validação da integridade da cadeia
- API RESTful para interação

## Tecnologias

- Node.js
- TypeScript
- Express
- SHA-256 para hashing

## Instalação

```bash
npm install
# ou
yarn install
```

## Executando

Desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

Produção:
```bash
npm run build && npm start
# ou
yarn build && yarn start
```

## API Endpoints

### GET /blockchain/blocks
Lista todos os blocos da chain

### POST /blockchain/blocks
Adiciona um novo bloco
```json
{
  "data": "Seus dados aqui"
}
```

### GET /blockchain/validate
Verifica a integridade da blockchain

## Estrutura do Projeto

```
src/
  ├── core/           # Core blockchain logic
  ├── controllers/    # API controllers
  ├── routes/         # Route definitions
  ├── types/          # TypeScript interfaces
  └── utils/          # Utilities
```