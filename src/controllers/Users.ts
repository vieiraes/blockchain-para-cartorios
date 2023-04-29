import express from 'express'
import { Request, Response } from 'express'
import { prisma } from '../../prisma'

const router = express.Router()

enum Types {
    ADMIN = "ADMIN",
    USER = "USER",
}

router.post("/", async (req: Request, res: Response) => {
    const { name, roletype } = req.body
    if (!name || !roletype) {
        res.status(400).json("Missing parameters")
        return
    }
    if (roletype == Types.ADMIN) {
        res.status(400).json("Creation not valid. Get a prmission first")
        return
    }
    if (roletype != "admin" && roletype != "user") {
        res.status(400).json("Invalid role")
        return
    }
    let objectreturn = {
        name: name,
        role: roletype,
    }
    const retorno = await prisma.post.create(objectreturn)
    res.status(200).send(Rreturn)
})

export { router }