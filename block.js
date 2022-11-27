import { createHmac } from 'node:crypto'
import { objeto } from './models/models.js'

export function generateHash(data) {

    const secret = JSON.stringify(data);
    const hash = createHmac('sha256', secret).update('I love cupcakes').digest('hex');
    return hash
}


var result = generateHash(objeto)
console.log("Hash gerado", result);

// ///encode it for base64
// function encodetoBase64(data) {
//     let buff = Buffer.from(data);
//     let base64 = buff.toString('base64');
//     return base64

// }

// encodetoBase64(generateHash().hash)
// console.log('codificado', encodetoBase64().hash)


// ///decode it for string
// function decodeBase64(data) {
//     let base64Stringified = Buffer.from(data, "base64").toString();
//     base64Stringified = JSON.parse(base64Stringified);
//     console.log("decodificado", base64Stringified)
//     return base64Stringified

// }

// decodeBase64(stringToBase64)





// function verifyHash(hashData) {




// }

// //gera o bloco
// function generateBlock(dataBlockObject) {



//     var hashCaclulated = calculateHash(blockObject)

//     dataBlockObject['hash'] = hashCaclulated

// }



// function blockExecute(hashToVerify) {

//     try {
//         var previousHash = blockChainArray[0].crypto
//         console.log(previousHash)


//         if (hashToVerify === previousHash) {


//         }
//     } catch (error) {
//         console.log(`Hash not acceptable`, JSON.stringify(hashToVerify))
//     }


// }
