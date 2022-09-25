import { blockChainArray } from "../main.js"



export const registerOnLedger = (req, res, next) => {

    if (!req.body) {
        res.status(400).json({
            "message": "bad request"
        });

    } else {
        try {
            const { datas } = req.body;

            const objeto = {
                index: "2",
                timestamp: new Date(),
                previousHash: "1kj3fhg12jkh3g12hjk3ghk12jjkgh12j3hk",
                datas: datas
            }

            blockChainArray.push(objeto)

            res.status(201).json({
                "message": "created",
                "block": objeto
            });



        } catch (error) {
            res.status(500).jsonledgerRouter
        }

    };
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