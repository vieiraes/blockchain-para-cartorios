import { generateHash } from '../block.js'
import { blockChainArray } from '../main.js'

const findPreviousHash = blockChainArray.find((previousHash) => {
    return objeto.previousHash === previousHash
});

console.log(findPreviousHash)

export const compare = function compareHashes(req, res, next) {

    //CRIAR MODO QUE GERE O HASH ATUAL DE UM BLOCO
    /* 
    /pegar um bloco atual montado no objeto
    //gerar um hash em cima desse bloco atual
    trazer esse hash gerado pra cá 
    verificar se o hash atual é igual ao hash anterior
     */
    req = () => {

        let hashGerado = findPreviousHash


        if (hashAnterior === hashGerado) {
            res.stats(400).json({
                "message": "Hash incompatível"
            })

        } else {
            console.log("Hash válido!");
        }
        next()
    }

}