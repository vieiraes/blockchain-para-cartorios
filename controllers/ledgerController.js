function registerOnLedger(req, res, next) {

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
    next()
};







function listAll(req, res, next) {
}

function remove(req, res, next) {

}


export { registerOnLedger, listAll, remove };

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