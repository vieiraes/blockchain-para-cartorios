import { startServer } from './server.js';
import { objeto } from './models/models.js'
import { registerOnLedger } from './controllers/ledgerController.js'
import { app } from './server.js'
import { ledgerRouter } from './routes/ledger.js'



startServer()


export var blockChainArray = []


function generateGenesisBlock() {

  const genesisBlock = Object.assign(objeto, { counter: 0 })
  blockChainArray.push(genesisBlock)

}
generateGenesisBlock()

//ROTAS
app.get('/status', (req, res) => res.status(200).json({ 'message': 'status ok!' }))
app.use('/ledger', ledgerRouter)



// function generateBlock() {


//     function writeToChain(data) {
//         blockChainArray.push(data)
//         return console.log(blockChainArray)
//     }

// }

// function createChain() {

//     object = {
//         index: blockObject.index,
//         timestamp: blockObject.timestamp,
//         previousHash: blockObject.previousHash,
//         datas: blockObject.datas,
//     }

// }