import { ledgerDB, IBlock } from './controllers/Legder'
import { v4 as uuid } from "uuid";
import { toHash } from '../utils/hash'


console.log("ANTES\n",ledgerDB)

export async function genesisBlock() {
  
  let object: any = {
    blockId: uuid(),
    blockNumber: 1,
    createdAt: new Date(),
    datas: ["dados que quero jogar na ledger", "mais dados que quero jogar an ledger"]
  }
  let hashed = toHash(JSON.stringify(object))
  object.hashId = ((await hashed).toString())
  //@ts-ignore 
  const result = ledgerDB.push(object) 
  console.log("OBJETO\n",ledgerDB)
  return result
}


