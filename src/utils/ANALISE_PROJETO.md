# Análise do Projeto Blockchain em TypeScript

## 1. Visão Geral

Este documento resume a análise inicial do projeto, detalhando sua arquitetura, tecnologias e funcionalidades principais. O objetivo é registrar o entendimento atual do sistema antes de iniciar novas implementações ou refatorações.

## 2. Tecnologia e Dependências

-   **Core:** Node.js com TypeScript.
-   **Framework:** Express.js para a criação do servidor e das rotas da API.
-   **Dependências Principais:**
    -   `express`: Framework web.
    -   `bip39`: Para geração de palavras mnemônicas (usado na criação de "Issuers").
    -   `uuid`: Para gerar IDs únicos.
    -   `typescript`, `ts-node`, `tsx`, `nodemon`: Ferramentas para desenvolvimento em TypeScript.
-   **Scripts (`package.json`):**
    -   `build`: Compila o projeto TypeScript para JavaScript em `dist/`.
    -   `dev`: Executa o servidor em modo de desenvolvimento com hot-reload.
    -   `start`: Executa a versão compilada do projeto (produção).

## 3. Arquitetura e Estrutura de Código

O projeto segue uma arquitetura de API RESTful com uma clara separação de responsabilidades:

-   `src/server.ts`: Ponto de entrada da aplicação. Configura o servidor Express e inicializa as rotas principais.
-   `src/routes/`: Define os endpoints da API (`/blockchain` e `/issuers`) e os associa aos controladores correspondentes.
-   `src/controllers/`: Contém a lógica de manipulação das requisições (request) e respostas (response). Serve como uma camada intermediária entre as rotas e a lógica de negócio.
-   `src/core/`: Contém as classes com a lógica de negócio principal (`Blockchain.class.ts`, `Issuer.class.ts`). É o núcleo da aplicação.
-   `src/types/`: Define as interfaces e tipos de dados (e.g., `Block`, `Issuer`), garantindo a consistência e a tipagem do código.

## 4. Funcionalidades Principais

### Módulo Blockchain (`Blockchain.class.ts`)

-   Implementa uma blockchain **em memória**.
-   Cria um "Bloco Gênesis" na inicialização para servir como o primeiro elo da cadeia.
-   Permite adicionar novos blocos contendo dados (`contents`), timestamp e a identificação de um `issuer`.
-   Calcula e armazena o hash de cada bloco e o hash do bloco anterior para garantir a imutabilidade e a integridade da cadeia.
-   Oferece métodos para validar a cadeia, obter blocos individuais e a cadeia completa.

### Módulo de Emissores (`Issuer.class.ts`)

-   Gerencia "Emissores" (`Issuers`), que são as entidades autorizadas a registrar informações na blockchain.
-   O processo de criação de um emissor gera 13 palavras secretas (mnemônico) e um hash derivado delas, que funciona como uma chave privada.
-   Um emissor precisa ser "credenciado" (`accreditIssuer`) fornecendo o hash correto, o que o marca como `isAccredited`. Este passo é crucial para validar a identidade do emissor.

### Módulo Ledger (`Legder.ts`)

-   **Ponto de Conflito:** Este arquivo parece ser uma implementação alternativa ou um resquício de uma versão anterior.
-   Utiliza `PrismaClient`, indicando uma tentativa de integração com banco de dados, algo que não está presente no resto da aplicação.
-   Define sua própria lógica de rotas e manipulação de blocos, que conflita com a implementação principal em `Blockchain.class.ts`.
-   **Importante:** Este módulo não é importado ou utilizado em `server.ts`, estando efetivamente inativo no fluxo principal da aplicação.

## 5. Dúvidas e Pontos de Atenção

1.  **Persistência de Dados:** A blockchain e os emissores são armazenados apenas em memória. Isso significa que todos os dados são perdidos quando a aplicação é reiniciada. É necessário confirmar se este comportamento é intencional ou se a persistência em banco de dados será implementada.
2.  **Módulo `Legder.ts`:** O arquivo `src/controllers/Legder.ts` está desconectado e conflita com a arquitetura principal. Recomenda-se decidir se ele deve ser removido para evitar confusão ou se sua lógica deve ser integrada ao core da aplicação.
3.  **Fluxo de Segurança:** O fluxo para um usuário gerar o hash de acreditação a partir das 13 palavras secretas precisa ser claro. A rota `POST /issuers/generate-hash` parece servir a este propósito, mas o processo completo de ponta a ponta deve ser validado.
