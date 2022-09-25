// import router from './routes/router.cjs'
import express from 'express'
import LedgerRouter from './routes/ledger.router.js'

import { blockObject } from "./block.js"
import { startServer } from './server.js';

const app = express()

startServer()

//blockchain array
export var blockChainArray = []




app.use('/ledger', LedgerRouter)
// app.use('/block', BlockRouter)





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

export { app }
