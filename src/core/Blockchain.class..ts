import { createHash } from 'crypto';

interface Block {
    index: number;
    timestamp: string;
    data: any;
    previousHash: string;
    hash: string;
}

export class BlockChain {
    private chain: Block[];

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    private createGenesisBlock(): Block {
        const block = {
            index: 0,
            timestamp: new Date().toISOString(),
            data: "Genesis Block",
            previousHash: "0",
            hash: ""
        };
        block.hash = this.calculateHash(block);
        return block;
    }

    private calculateHash(block: Omit<Block, 'hash'>): string {
        return createHash('sha256')
            .update(block.index + block.previousHash + block.timestamp + JSON.stringify(block.data))
            .digest('hex');
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data: any): Block {
        const previousBlock = this.getLatestBlock();
        const newBlock: Block = {
            index: previousBlock.index + 1,
            timestamp: new Date().toISOString(),
            data: data,
            previousHash: previousBlock.hash,
            hash: ""
        };
        newBlock.hash = this.calculateHash(newBlock);
        this.chain.push(newBlock);
        return newBlock;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Verifica se o hash atual é válido
            if (currentBlock.hash !== this.calculateHash(currentBlock)) {
                return false;
            }

            // Verifica se o previousHash aponta para o hash correto
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    getChain(): Block[] {
        return this.chain;
    }
}