const Block = require('./block.js')


var blockChainArray = []


function createBlock(data){
    
    blockChainArray.push(data)
}

const blockCreated  = createBlock(Block)


console.log(blockChainArray)
console.log(blockCreated)


module.exports = blockChainArray

// function verifyChain(){
    
    // }

    // function createChain(){
        
        //     object = {
            //         index : block.index,
            //         timestamp: block.timestamp,
            //         data: block.data,
            //         previousHash: block.previousHash
            
            
            //     }
            
            // }