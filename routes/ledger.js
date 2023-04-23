import express from "express";
import { blockChainArray } from "../main.js";
import { objeto } from "../models/models.js"


const router = express.Router();

//all aroutes in this file will be prefixed with /ledger
router.post('/', (req, res) => {
    const { datas, previousHash } = req.body;
    if (!datas) {
        res.status(400).json({
            "message": "no datas defined on body request"
        })
    } else if (datas.length === 0) {
        res.status(400).json({
            "message": "no data to register"
        })
    } else if (!previousHash) {
        res.status(400).json({
            "message": "no previous hash defined on body request"
        })
    } else {
        try {
            const lastBlock = blockChainArray[blockChainArray.length - 1]
            if (lastBlock.randomBytes === previousHash) {
                const newObject = objeto
                const newBlock = Object.assign(newObject,
                    {
                        counter: lastBlock.counter + 1,
                        datas: datas
                    })
                blockChainArray.push(newBlock)
                res.status(200).json({
                    "message": "ok",
                    "block": newBlock
                })
            } else {
                res.status(400).json({
                    "message": "previousHash does not match"
                })
            }
            if (findHash) {
                console.log("hash encontrado");
            } else {
                console.log("hash não encontrado");
            }
            console.log(findHash);
            console.log(blockChainArray);
            res.status(201).json({
                "message": "created",
                "block": objeto
            });
        } catch (error) {
            res.status(500).json({ "message": "internal server error" });
        }
    };
})

router.get('/', (req, res) => {

    res.status(200).json({
        "message": "ok",
        "ledger": blockChainArray
    });
})





// import { registerOnLedger } from '../controllers/ledgerController.js'



// const registerOnLedger = (req, res) => {
//     res.status(200).json({
//         "message": "created",
//         "block": objeto
//     });

// }

// export { registerOnLedger }
export { router as ledgerRouter };