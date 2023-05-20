# Blockchain Record Assurance - API 🔏

## Em construção 🚧
API de registros de informações em Blockchain com verificação de veracidade de informações declaradas através de consulta de chave hash criptografada.
Uma vez um resgistro gravado na Blockchain, ele não estárá mais visivel para as nenhumas das pessoas.
A única forma de garantir que o os dados escritos na Blockchain é apenas através de uma consulta de chave criptografada que representará todo o texto que a pessoa deseja verificar se o registro é verídico ous não.

## Under construction 🚧

API for records of information on Blockchain with veracity verification of declared information through encrypted hash key query.
Once a record is recorded on the Blockchain, it will no longer be visible to anyone.
The only way to guarantee that the data written on the Blockchain is only through an encrypted key query that will represent all the text that the person wants to verify if the record is true or not.



## Iniciando projeto

- yarn install - instala as dependẽncias do  projeto
- yarn migrate - persiste as tabelas necessárias 
# Routes

 - POST /ledger - records information on the blockchain, it is necessary to inform the hash of the previous block
 - POST /validate - returns the registered information of a block, based on the declared id and Hash
 - GET /leger - returns a list of all registered blocks with the creation date and an identification id
 - GET /leger with header 'x-audit-key' - returns the entire string of information recorded in the ledger

# API Documentation
[https://documenter.getpostman.com/view/20418848/2s93eSab1P](https://documenter.getpostman.com/view/20418848/2s93eSab1P)

### made with
- Typescript
- Prisma
- Postgres
- Docker-compose


