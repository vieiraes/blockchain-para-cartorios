import { v4 as uuid } from "uuid";
import { toHash } from '../utils/toHash'
import { setBase64 } from '../utils/setBase64'
import { PrismaClient } from '@prisma/client'
import { IBlock } from './interfaces/IBlock'
import { IIntermediateBlock } from './interfaces/IIntermediateBlock'

const prisma = new PrismaClient()

export async function genesisBlock() {
  try {
    let intermediateBlock: IIntermediateBlock = {
      createdAt: new Date().toISOString(),
      datas: ["dados que quero jogar na ledger", "mais dados que quero jogar an ledger"],
    }
    let objectHashed = ((await toHash(JSON.stringify(intermediateBlock))).toString())
    let base64 = setBase64(JSON.stringify(objectHashed)).toString()
    const numberBlockReturn = await prisma.block.findFirst({ orderBy: { blockNumber: 'desc' } })
    const bNumber: number = numberBlockReturn ? numberBlockReturn.blockNumber + 1 : 1

    let object: IBlock = {
      id: uuid(),
      blockNumber: bNumber,
      createdAt: intermediateBlock.createdAt,
      hashId: objectHashed,
      base64: base64,
      datas: intermediateBlock.datas,
    }
    
    //@ts-ignore
    const resolver = await prisma.block.create({ data: object })

    return resolver
  } catch (error) {
    console.log(error)
    return null
  }
}