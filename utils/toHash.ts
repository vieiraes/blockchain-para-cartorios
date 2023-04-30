import { promisify } from 'util';
import { createCipheriv, createDecipheriv, randomBytes, createHash, scrypt } from 'crypto';
import swaggerUI from 'swagger-ui-express';

//HASHEAR
export async function toHash(value: String | any) {
    let hash = createHash('sha256').update(value).digest('hex')
    return hash
}

//VERIFICAR
export async function toVerify(hash: string, value: string) {
    let toCompare = await createHash('sha256').update(value).digest('hex')
    const compareHash = async (hashValue: string, toCompare: string) => {
        return hashValue == toCompare;
    }
    const result = await compareHash(hash, toCompare);
    console.log("RESULTADO", result)
}
