import express from 'express'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()

const prisma = new PrismaClient()

// export interface IBlock {
//     hashId?: string | any,
//     blockId?: string
//     blockNumber?: number,
//     createdAt?: string | Date,
//     datas: String[]
// }

router.get('/', async (req: Request, res: Response) => {
    const data = await prisma.block.findMany()
    res.status(200).json({ ledger: data })
})

//TODO: continuar o compare
// router.post('/compare', (req: Request, res: Response) => {
//     let comparison:boolean 
//     const { hash, base64 } = req.body

//     const object = {
//         hash,
//         base64
//     }

//     res.status(200).json({
//         'comparison': comparison,

//     })

// })



export { router }