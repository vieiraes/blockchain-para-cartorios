require("dotenv").config()
import { v4 as uuid } from "uuid"
import { toHash } from './lib/utils/toHash'
// import { setBase64 } from './lib/utils/setBase64'
import { prisma } from './lib/db'
import { IBlock } from './interfaces/IBlock'
import { IIntermediateBlock } from './interfaces/IIntermediateBlock'


async function main() {
  try {
    let intermediateBlock: IIntermediateBlock = {
      createdAt: new Date().toISOString(),
      datas: ["GENESIS BLOCK"],
    }
    
    let object: IBlock = {
      id: uuid(),
      blockNumber: 1,
      createdAt: intermediateBlock.createdAt,
      hash: process.env.HASH_GENESIS as string,
      datas: intermediateBlock.datas,
    }
    const resolver = await prisma.blocks.create({ data: object })
    console.log('Genesis block created')
    console.log(resolver)
    return resolver
  } catch (error) {
    console.log(error)
    throw new Error(error as string)
  }
}

export async function genesisBlock() {
  const firstBlock = await prisma.blocks.findFirst({ orderBy: { blockNumber: 'asc' } })

  if (!firstBlock) {
    console.log('Creating Genesis Block')
    await main()
    return
  }

  if (firstBlock?.hash === process.env.HASH_GENESIS) {
    return  async ()=>{
      console.log('Genesis block matched! Blockchain initilized!')      
    }
  }

  if (firstBlock?.hash != process.env.HASH_GENESIS) {
    throw new Error("Genesis Block do not match!")
  }
}