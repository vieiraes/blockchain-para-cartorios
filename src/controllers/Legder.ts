import express from 'express'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { toHash } from '../lib/utils/toHash'
import { IIntermediateBlock } from "../interfaces/IIntermediateBlock";
import { IBlock } from '../interfaces/IBlock';
import { v4 as uuid } from "uuid";

const router = express.Router()

const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await prisma.blocks.findMany({
            orderBy: {
                blockNumber: 'desc'
            }
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send({ "Message": "Error" })
        console.log(error)
    }
})


router.post('/', async (req: Request, res: Response) => {
    try {
        const { datas }: { datas: string[] } = req.body
        //TODO: ACRECENTAR NO HEADER O PREVIOUS HASH
        // const { previousHash }: { previousHash: string } = req.headers['x-previousHash']

        let intermediateBlock: IIntermediateBlock = {
            createdAt: new Date().toISOString(),
            datas: datas,
        }

        const hash = (await toHash(JSON.stringify(intermediateBlock))).toString()
        // const base64 = (await setBase64(JSON.stringify(hash)).toString())
        const objectResult = await prisma.blocks.findFirst({ orderBy: { blockNumber: 'desc' } })
        const handleSendServerError = (res: Response, message: string) => {
            res.status(500).send({ message })
            console.error(message)
            throw new Error(message)
        }

        const bNumber = (): number | any => {
            if (objectResult) {
                const blockNumber = objectResult.blockNumber + 1
                return blockNumber
            } else {
                handleSendServerError(res, 'Error getting blockNumber')
            }
        }

        // var mypromise = new Promise((resolve, reject) => {
        //     const hash: string = toHash(JSON.stringify(intermediateBlock)).toString()
        //     resolve(hash)
        // });
        // mypromise.then((hash) => {
        //    return hash
        // }).catch((err) => {
        //     console.log("inside error block " + err)
        // })

        const object: IBlock = {
            id: uuid(),
            blockNumber: bNumber(),
            createdAt: intermediateBlock.createdAt,
            hash: hash,
            datas: intermediateBlock.datas
        }

        // @ts-ignore
        const resolver = await prisma.blocks.create({ data: object })
        res.status(201).send(resolver)
    } catch (error) {
        console.log(error)
        res.status(400).send({ "Message": "Error" })
    }
})

export { router }