import express from 'express'
import { Request, Response } from 'express'

const router = express.Router()

//SIMULAR UM BD LEDGER
export let ledgerDB = []

export interface IBlock {
    hashId?: string | any,
    blockId?: string
    blockNumber?: number,
    createdAt?: string | Date,
    datas: String[]
}

router.get('/', (req: Request, res: Response) => {
    res.status(200).json(ledgerDB)
})


router.post('/compare', (req: Request, res: Response) => {
    let comparison:boolean 
    const { hash, data } = req.body

    const object = {
        hash,
        data
    }

    res.status(200).json({
        'comparison': comparison,

    })

})

export { router }