# Blockchain para Cartórios

## Visão Geral para o Product Owner

### O que é este projeto?

Este é um sistema de certificação digital (um "cartório digital") que utiliza a tecnologia blockchain para garantir a autenticidade e a imutabilidade de registros. Ele funciona como um livro-razão digital, onde informações, uma vez inseridas, não podem ser alteradas ou removidas.

### Qual problema resolve?

O projeto ataca a necessidade de confiança e segurança em processos cartoriais. Ele oferece:

- **Imutabilidade:** Uma vez que um documento é registrado na blockchain, ele não pode ser alterado, garantindo sua integridade para sempre.
- **Transparência e Auditoria:** Cria uma trilha de auditoria perfeita e transparente. Qualquer pessoa com acesso pode verificar a validade de um registro, mas apenas entidades autorizadas podem criar novos registros.
- **Segurança:** Reduz drasticamente o risco de fraudes, pois cada registro é selado com criptografia avançada.

### Como funciona? (Em termos simples)

O fluxo de trabalho do sistema se baseia em dois conceitos principais:

1.  **Credenciamento de Cartórios (Issuers):**
    - Apenas cartórios autorizados podem registrar documentos. Para isso, eles passam por um processo de credenciamento seguro. Ao ser criado, o cartório recebe um conjunto de "palavras secretas".
    - Usando essas palavras, ele gera uma chave (hash) que prova sua identidade e o credencia no sistema. Apenas após o credenciamento ele pode operar.

2.  **Registro de Documentos em Blocos:**
    - Um cartório credenciado pode registrar um ou mais documentos (como escrituras, certidões, etc.) em um novo "bloco".
    - Cada novo bloco é "acorrentado" ao bloco anterior usando criptografia. Isso forma a "blockchain", uma corrente de blocos segura e interligada.

---

## Capacidades Atuais da API

A API atual permite realizar as seguintes operações:

#### Gestão de Cartórios (Issuers)
- **Criar** um novo cartório no sistema (que recebe suas palavras secretas).
- **Gerar a chave** de credenciamento a partir das palavras secretas.
- **Credenciar** um cartório usando sua chave para autorizá-lo a operar.
- **Listar** todos os cartórios cadastrados.
- **Consultar** os dados de um cartório específico.

#### Operações da Blockchain
- **Registrar** um novo conjunto de documentos em um bloco.
- **Consultar** todos os blocos da cadeia (com paginação).
- **Consultar** um bloco específico pelo seu número de índice.
- **Validar** a integridade de toda a cadeia de blocos.
- **Obter um Ledger**, que é uma visão resumida e otimizada da blockchain.

---

## Arquitetura e Persistência de Dados

- **Tecnologia:** O backend é construído em Node.js usando TypeScript, o que garante um código robusto e moderno.
- **Persistência:** Diferente de um protótipo simples, **todos os dados da aplicação são persistidos**. Utilizamos um banco de dados **Postgres**, gerenciado pela plataforma **Supabase**. A comunicação com o banco é feita de forma segura e eficiente através do **Prisma ORM**.

---

## Como Testar o Projeto

1.  **Inicie o servidor:** No seu terminal, execute o comando `npm run dev`.
2.  **Use o Postman:** Importe o arquivo `blockchain-api.postman_collection.json` que está na raiz do projeto para o seu Postman.
3.  **Execute as Requisições:** A coleção no Postman contém todas as chamadas de API mapeadas e prontas para serem usadas. Você pode seguir o fluxo (criar issuer, credenciar, adicionar bloco) para testar todas as funcionalidades.

---

## Roadmap

- [x] Sistema base de blockchain
- [x] Gestão de cartórios
- [x] API de consultas
- [x] **Persistência de dados com Supabase/Prisma**
- [ ] Interface administrativa
- [ ] Sistema de notificações
- [ ] Exportação de relatórios

## Autor

**Bruno Vieira**
- Github: [@vieiraes](https://github.com/vieiraes)
