import { createHash } from 'crypto';
import { Block, BlockData } from '../types/blockchain.types';

export class Blockchain {
    private chain: Block[];

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    private createGenesisBlock(): Block {
        const genesisData: BlockData = {
            id: "genesis",
            timestamp: new Date().toISOString(),
            issuer: "system",
            content: [{
                data: "Genesis Block",
                type: "string",
                hash: this.calculateHash("Genesis Block")
            }]
        };

        const block = {
            index: 0,
            timestamp: new Date().toISOString(),
            data: genesisData,
            previousBlockHash: "0",
            blockHash: ""
        };
        block.blockHash = this.calculateHash(block);
        return block;
    }

    private calculateHash(block: Omit<Block, 'hash'> | string): string {
        if (typeof block === 'string') {
            return createHash('sha256').update(block).digest('hex');
        }
        return createHash('sha256')
            .update(block.index + block.previousHash + block.timestamp + JSON.stringify(block.data))
            .digest('hex');
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data: BlockData): Block {
        const previousBlock = this.getLatestBlock();
        const newBlock: Block = {
            index: previousBlock.index + 1,
            timestamp: new Date().toISOString(),
            data: data,
            previousBlockHash: previousBlock.blockHash,  // era 'previousHash' e 'hash'
            blockHash: ""                              // era 'hash'
        };
        newBlock.blockHash = this.calculateHash(newBlock);  // era 'hash'
        this.chain.push(newBlock);
        return newBlock;
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Verifica hash atual
            if (currentBlock.blockHash !== this.calculateHash(currentBlock)) {
                return false;
            }

            // Verifica ligação com bloco anterior
            if (currentBlock.previousBlockHash !== previousBlock.blockHash) {
                return false;
            }

            // Verifica timestamps
            if (new Date(currentBlock.timestamp) < new Date(previousBlock.timestamp)) {
                return false;
            }
        }
        return true;
    }

    getChain(): Block[] {
        return this.chain;
    }

    public getBlockByIndex(index: number): Block | null {
        return this.chain.find(block => block.index === index) || null;
    }
}