require("dotenv").config()
import express from 'express'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { toHash } from '../utils/toHash'
import { IIntermediateBlock } from "../interfaces/IIntermediateBlock";
import { IBlock } from '../interfaces/IBlock';
import { v4 as uuid } from "uuid";


const router = express.Router()

const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response) => {
    const auditKey: string = req.header['x-audit-key'] as string
    function filterData(data: any): any {
        const allowedAttributes = ['id', 'blockNumber', 'createdAt'];
        const filteredData: any = {};
        for (const attr of allowedAttributes) {
            if (attr in data) {
                filteredData[attr] = data[attr];
            }
        }
        return filteredData;
    }
    try {
        const data = await prisma.blocks.findMany({
            orderBy: {
                blockNumber: 'desc'
            }
        })
        if (auditKey === process.env.AUDIT_KEY as string) {
            return res.status(200).json({
                "message": "AUDIT",
                data
            })
        }
        const filteredData = data.map(filterData);
        res.status(200).json(filteredData)

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
        const objectResult = await prisma.blocks.findFirst({ orderBy: { blockNumber: 'desc' } })
        const bNumber = (): number | any => {
            if (objectResult) {
                const blockNumber = objectResult.blockNumber + 1
                return blockNumber
            } else {
                const handleSendServerError = (res: Response, message: string) => {
                    res.status(500).send({ message })
                    console.error(message)
                    throw new Error(message)
                }
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


router.post('/validate', async (req: Request, res: Response) => {
    try {
        const { auditHash }: { auditHash: string } = req.body
        const { idNumber }: { idNumber: number } = req.body
        //BUSCAR UM REGISTRO COM A REGRA DE VALIDACAO DE 3 CAMPOS
        const returnObject = await prisma.blocks.findFirst({
            where: { hash: auditHash, blockNumber: idNumber }
        })

        let handleError = (res: Response, statusCode: number, message: string) => {
            res.status(statusCode).send({ message })
            console.error(message)

        }

        if (!auditHash || !idNumber) {
            return handleError(res, 400, 'Some data are missing')
        }

        if (!returnObject) {
            return handleError(res, 404, `Cannot find this register: ${returnObject}`)
        }

        if (returnObject.hash === auditHash || returnObject.blockNumber === idNumber) {
            return res.status(201).send({
                "message": 'Register validated',
                "data": [returnObject]
            })

        } else {
            return handleError(res, 412, 'Error in verifiation')
        }

    } catch (error) {
        res.status(400).send({ "Message": error })
    }
})




export { router }