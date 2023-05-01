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
        const previousHashHeader: string = req.headers['x-previoushash'] as string
        if (!previousHashHeader) {
            console.log('Error: x-previousHash header is missing')
            return res.status(412).send({ "message": "Error: x-previousHash header is missing" })
        }
        const lastBlock = await prisma.blocks.findFirst({ orderBy: { blockNumber: 'desc' } })
        if (previousHashHeader != lastBlock?.hash) {
            console.log('Error de Hash')
            return res.status(412).send({ "message": "x-previousHash header is not valid" })
        }
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
        const object: IBlock = {
            id: uuid(),
            blockNumber: bNumber(),
            createdAt: intermediateBlock.createdAt,
            hash: hash,
            datas: intermediateBlock.datas
        }


        const resolver = await prisma.blocks.create({ data: object })
        res.status(201).send(resolver)
    } catch (error) {
        console.log(error)
        res.status(400).send({ "Message": "Error" })
    }
})

//TODO: FAZER A ROTA DE VERFICICACAO DE AUTENTICIDADE
// router.get('/verify', async (req: Request, res: Response) => {
//     async function main() {
//         const { hashToVerify }: string = req.body as string
//         const { dataToVerify }: string = req.body as string
//     }

//     prisma.blocks.findFirst({ where: { hash: hashToVerify } })
// })


// try {
//     main()
// } catch (error) {
//     console.log(error)
//     res.status(400).send({ "Message": "Error" })

// }




export { router }