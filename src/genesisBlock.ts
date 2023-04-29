import { v4 as uuid } from "uuid";
import { toHash } from '../utils/hash'
import { setBase64 } from '../utils/setBase64'
import { PrismaClient } from '@prisma/client'

interface IBlock {
  id: string
  blockNumber: number
  createdAt?: string
  hashId?: string
  base64?: string
  datas: string[]
}

const prisma = new PrismaClient()

export async function genesisBlock() {
  try {
    let earlierBlock = {
      createdAt: new Date().toISOString(),
      datas: ["dados que quero jogar na ledger", "mais dados que quero jogar an ledger"],
    }
    let objectHashed = ((await toHash(JSON.stringify(earlierBlock))).toString())
    let base64 = setBase64(JSON.stringify(objectHashed)).toString()
    let object: IBlock = {
      id: uuid(),
      blockNumber: 0,
      createdAt: earlierBlock.createdAt,
      hashId: objectHashed,
      base64: base64,
      datas: earlierBlock.datas,
    }
    // ledgerDB.push(object)
    //@ts-ignore
    const resolver = await prisma.block.create({ data: object })

    return resolver
  } catch (error) {
    console.log(error)
    return null
  }
}

