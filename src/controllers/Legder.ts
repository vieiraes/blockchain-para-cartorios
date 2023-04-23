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

//TODO: continuar o compare
router.post('/compare', (req: Request, res: Response) => {
    let comparison:boolean 
    const { hash, base64 } = req.body

    const object = {
        hash,
        base64
    }

    res.status(200).json({
        'comparison': comparison,

    })

})

export { router }