import { blockChainArray } from "../../../main.js"
import { objeto } from "../models/models.js"

export const registerOnLedger = (req, res, next) => {
    const { datas, previousHash } = req.body;
    if (!datas) {
        res.status(400).json({
            "message": "no datas defined on body request"
        })
        return next()
    } else if (datas.length === 0) {
        res.status(400).json({
            "message": "no data to register"
        })
        return next()
    } else if (!previousHash) {
        res.status(400).json({
            "message": "no previous hash defined on body request"
        })
        return next()
    } else {
        try {
            const lastBlock = customersDB[customersDB.length - 1]
            if (lastBlock.randomBytes === previousHash) {
                const newBlock = Object.assign(objeto,
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
            console.log(blockChainArray);
            console.log(findHash);
            res.status(201).json({
                "message": "created",
                "block": objeto
            });
        } catch (error) {
            res.status(500).json({ "message": "internal server error" });
        }
    };
    next();
}

// export { registerOnLedger };

// app.post('/ledger', (req, res) => {

//     const { datas } = req.body;

//     const objeto = {
//         index: "2",
//         timestamp: new Date(),
//         previousHash: "1kj3fhg12jkh3g12hjk3ghk12jjkgh12j3hk",
//         datas: datas
//     }

//     blockChainArray.push(objeto)

//     res.status(201).json({
//         "message": "created",
//         "block": objeto
//     });
// });




// app.get('/ledger', (req, res) => {

//     res.status(200).json({
//         "message": "ok",
//         "block": blockChainArray
//     });
//     res.send('GET request to the homepage')
// })