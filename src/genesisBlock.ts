import { ledgerDB, IBlock } from './controllers/Legder'
import { v4 as uuid } from "uuid";
import { toHash } from '../utils/hash'
import { setBase64 } from '../utils/setBase64'

console.log("ANTES\n", ledgerDB)

export async function genesisBlock() {

  let object: any = {
    blockId: uuid(),
    blockNumber: 1,
    createdAt: new Date(),
    datas: ["dados que quero jogar na ledger", "mais dados que quero jogar an ledger"]
  }
  let hashed = toHash(JSON.stringify(object))

  let hash = (await hashed).toString()
  object.hashId = hash
  let base = setBase64(JSON.stringify(object)).toString()
  object.base64 = base
  //@ts-ignore 
  const result = ledgerDB.push(object)
  console.log("RESULT\n", result)
  console.log("DEPOIS\n", ledgerDB)
  return result
}

