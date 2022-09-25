import router from './routes/router.cjs'
import express from 'express'
import { registerOnLedger } from './controllers/ledgerController.js'

import { blockObject } from "./block.js"
import { startServer } from './server.js';

const app = express()

startServer()

//blockchain array
export var blockChainArray = []




app.use('/ledger', registerOnLedger)

//writeToChain(blockObject)




function writeToChain(data) {
    blockChainArray.push(data)
    return console.log(blockChainArray)
}

function verifyChain() {


}




function createChain() {

    object = {
        index: blockObject.index,
        timestamp: blockObject.timestamp,
        previousHash: blockObject.previousHash,
        datas: blockObject.datas,
    }

}
