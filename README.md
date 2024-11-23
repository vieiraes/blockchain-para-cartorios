# Blockchain para Cartórios

Sistema de certificação digital baseado em blockchain desenvolvido especialmente para cartórios, permitindo o registro imutável e verificável de documentos e informações cartoriais.


## Visão do Produto
Este sistema oferece uma plataforma robusta para certificação digital cartorial, onde cartórios credenciados (Issuers) podem registrar e validar documentos e informações em uma blockchain. Cada registro é criptograficamente seguro e permanentemente armazenado, garantindo autenticidade e imutabilidade dos dados.

## Objetivos
- Transparência: Proporcionar um sistema onde todos os registros possam ser auditados publicamente.
- Segurança: Utilizar a criptografia para garantir que os dados estejam seguros e imutáveis.
- Eficiência: Reduzir o tempo e o custo tradicionalmente envolvidos em processos cartoriais.


### Principais Funcionalidades

#### 1. Gestão de Cartórios (Issuers)
- Processo de credenciamento em duas etapas
- Sistema de chaves criptográficas para autenticação
- Validação de autoridade cartorial
- Controle de acesso por credenciais

#### 2. Registro de Documentos
- Suporte a múltiplos tipos de dados (escrituras, registros, certidões)
- Hash criptográfico para cada documento
- Validação de integridade automática
- Rastreabilidade completa de registros cartoriais

#### 3. Consulta e Verificação
- Visualização detalhada de registros
- Consulta simplificada via ledger
- Verificação de autenticidade
- Histórico completo de certificações

### Dashboards e Visualizações
- Lista completa de blocos com paginação
- Visão resumida do ledger
- Contador de registros por bloco
- Status dos cartórios credenciados

## Guia Técnico

### Requisitos
- Node.js 16+
- TypeScript
- NPM ou Yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/vieiraes/blockchain-cartorios.git

# Instale as dependências
npm install
# ou
yarn install
```

### Configuração
Crie um arquivo `.env` baseado no `.env.example`:
```env
PORT=3434
```

### Executando
```bash
# Desenvolvimento
npm run dev
# ou
yarn dev

# Produção
npm run build && npm start
# ou
yarn build && yarn start
```

### Endpoints da API

#### Blockchain
- `GET /blockchain/blocks` - Lista todos os blocos
- `GET /blockchain/blocks/:index` - Busca bloco por índice
- `GET /blockchain/ledger` - Visão resumida do ledger
- `POST /blockchain/blocks` - Cria novo bloco

#### Issuers (Cartórios)
- `POST /issuers` - Registra novo cartório
- `POST /issuers/accreditation` - Processo de credenciamento
- `GET /issuers` - Lista cartórios
- `GET /issuers/:id` - Busca cartório específico

## Roadmap

- [x] Sistema base de blockchain
- [x] Gestão de cartórios
- [x] API de consultas
- [ ] Interface administrativa
- [ ] Sistema de notificações
- [ ] Exportação de relatórios

## Autor

**Bruno Vieira**
- Github: [@vieiraes](https://github.com/vieiraes)