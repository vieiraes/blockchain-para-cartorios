# Propostas de Demanda para o MVP da Blockchain

Este documento lista as funcionalidades e melhorias propostas para transformar o projeto em um Mínimo Produto Viável (MVP). As demandas estão organizadas por prioridade.

---

### ~~Demanda 1: Implementar Persistência de Dados (Prioridade: CRÍTICA)~~ - ✅ **CONCLUÍDA**

-   **Problema:** Atualmente, toda a blockchain (blocos e emissores) é armazenada em memória. Se a aplicação for reiniciada, todos os dados são perdidos. Isso inviabiliza o uso real do sistema.
-   **Solução Implementada:** O sistema foi refatorado para usar Prisma com PostgreSQL (Supabase) para persistência de dados. A cadeia de blocos e a lista de emissores são agora salvas e carregadas do banco de dados.
-   **Evidência:** 
    - Prisma schema com models `blocks` e `issuers`
    - `Blockchain.class.ts` utiliza Prisma client para todas as operações
    - `Issuer.class.ts` utiliza Prisma client para gerenciamento de emissores

---

### ~~Demanda 2: Aprimorar Segurança e Lógica dos Emissores (Prioridade: ALTA)~~ - ⚠️ **PARCIALMENTE CONCLUÍDA**

-   **Problema 1:** A API, ao criar um emissor, retorna as `secretWords`. Essas palavras são como uma senha mestra e nunca deveriam ser expostas após a criação.
-   **Status:** ⚠️ **PARCIALMENTE RESOLVIDO** - As secret words ainda são retornadas na criação do emissor, mas há um aviso no código que elas só devem ser mostradas uma vez. A melhoria completa seria não retorná-las após a criação inicial.

-   **Problema 2:** Não há uma verificação no endpoint de `addBlock` para garantir que o `issuer` (emissor) que está adicionando o bloco é uma entidade credenciada (`isAccredited`).
-   **Status:** ❌ **PENDENTE** - Não há verificação no `addBlock` para validar se o emissor é credenciado.

-   **Proposta Pendente:**
    1.  ~~Modificar a rota de criação de emissores para que as palavras secretas sejam exibidas **apenas uma vez** e nunca mais sejam retornadas pela API.~~
    2.  ❌ Adicionar uma lógica de verificação no `BlockchainController` para permitir que apenas emissores credenciados possam adicionar novos blocos à cadeia.

---

### ~~Demanda 3: Refatorar para um Modelo de Transações (Prioridade: MÉDIA)~~ - ❌ **PENDENTE**

-   **Problema:** Atualmente, um bloco armazena um campo `contents` genérico. Blockchains reais operam com o conceito de "transações", que são assinadas criptograficamente e depois agrupadas em blocos.
-   **Status:** ❌ **PENDENTE** - O sistema ainda não implementa um modelo de transações com mempool. Os blocos continuam armazenando diretamente o conteúdo em `contents`.

---

### ~~Demanda 4: Limpeza de Código e Padronização (Prioridade: TÉCNICA)~~ - ❌ **PENDENTE**

-   **Problema:** O arquivo `src/controllers/Legder.ts` contém código que não está em uso e que conflita com a arquitetura principal da aplicação, gerando confusão.
-   **Status:** ❌ **PENDENTE** - O arquivo `Legder.ts` ainda existe no projeto e não foi removido, mesmo não estando em uso nas rotas principais.

---

### ✅ **NOVA DEMANDA: Implementar Sistema de Testes** - ✅ **CONCLUÍDA**

-   **Problema:** O projeto não possuía testes automatizados, dificultando a manutenção e evolução do código com segurança.
-   **Solução Implementada:** Configuração completa do Vitest como framework de testes, com:
    - Testes unitários para as classes principais (Blockchain e Issuer)
    - Testes de controladores (endpoints REST)
    - Testes de integração entre componentes
    - Mocks para dependências externas (Prisma)
    - Configuração de comandos npm para execução dos testes
-   **Evidência:**
    - Arquivos de teste em `src/core/*.test.ts`
    - Arquivos de teste em `src/controllers/*.test.ts`
    - Arquivos de teste em `src/integration/*.test.ts`
    - Configuração em `vitest.config.ts`
    - Documentação em `src/utils/IMPLEMENTACAO_TESTES.md`

---