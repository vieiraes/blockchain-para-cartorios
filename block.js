const crypto = require('crypto-js/sha256');
const blockChainArray = require('./main.js')


function calculateHash(dataToHash) {
    return crypto(dataToHash)
}


//bloco montado
blockObject = {
    index: "1",
    timestamp: new Date(),
    previousHash: "eza",
    datas: ["qqulquecoisa", 112, true],
}

//gera hash do bloco montado e salva no objeto
function generateBlock(dataBlockObject) {
    var hashCaclulated = calculateHash(blockObject)
    dataBlockObject['hash'] = hashCaclulated

}





function blockExecute(hashToVerify) {

    try {
        var previousHash = blockChainArray[0].crypto
        console.log(previousHash)


        if (hashToVerify === previousHash) {


        }
    } catch (error) {
        console.log(`Hash not acceptable`, JSON.stringify(hashToVerify))
    }



    // return block
}



module.exports = blockExecute()