import { createHash } from 'crypto';
import { Block, BlockData } from '../types/blockchain.types';
import prisma from '../lib/prisma';
import { Prisma } from '../../generated/prisma';

export class Blockchain {

    constructor() {
        this.initializeChain();
    }

    private async initializeChain() {
        const genesisBlock = await prisma.blocks.findUnique({ where: { index: 0 } });
        if (!genesisBlock) {
            console.log("No genesis block found. Creating one...");
            await this.createGenesisBlock();
        }
    }

    private async createGenesisBlock(): Promise<Block> {
        const genesisData: BlockData = {
            id: "genesis",
            timestamp: new Date().toISOString(),
            issuer: "system",
            contents: [{
                data: "Genesis Block",
                type: "string",
                contentHash: this.calculateDataHash("Genesis Block")
            }]
        };

        const block: Omit<Block, 'blockHash'> = {
            index: 0,
            timestamp: new Date().toISOString(),
            data: genesisData,
            previousBlockHash: "0",
        };

        const blockHash = this.calculateBlockHash(block);
        
        const newBlock = await prisma.blocks.create({
            data: {
                index: block.index,
                timestamp: block.timestamp,
                data: block.data as unknown as Prisma.InputJsonValue,
                previous_block_hash: block.previousBlockHash, // Corrigido
                block_hash: blockHash // Corrigido
            }
        });

        return this.mapDbBlockToBlock(newBlock);
    }

    private calculateDataHash(data: any): string {
        return createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    private calculateBlockHash(block: Omit<Block, 'blockHash'>): string {
        return createHash('sha256')
            .update(block.index + block.previousBlockHash + block.timestamp + JSON.stringify(block.data))
            .digest('hex');
    }

    public async getLatestBlock(): Promise<Block | null> {
        const latestDbBlock = await prisma.blocks.findFirst({ orderBy: { index: 'desc' } });
        return latestDbBlock ? this.mapDbBlockToBlock(latestDbBlock) : null;
    }

    public async addBlock(data: BlockData): Promise<Block> {
        const previousBlock = await this.getLatestBlock();
        if (!previousBlock) {
            throw new Error("Genesis block not found. Cannot add new block.");
        }

        const newBlockData: Omit<Block, 'blockHash'> = {
            index: previousBlock.index + 1,
            timestamp: new Date().toISOString(),
            data: data,
            previousBlockHash: previousBlock.blockHash,
        };

        const blockHash = this.calculateBlockHash(newBlockData);

        const newDbBlock = await prisma.blocks.create({
            data: {
                index: newBlockData.index,
                timestamp: newBlockData.timestamp,
                data: newBlockData.data as unknown as Prisma.InputJsonValue,
                previous_block_hash: newBlockData.previousBlockHash, // Corrigido
                block_hash: blockHash // Corrigido
            }
        });

        return this.mapDbBlockToBlock(newDbBlock);
    }

    public async isChainValid(): Promise<boolean> {
        const chain = await this.getChain();
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];

            const currentBlockForHash: Omit<Block, 'blockHash'> = { ...currentBlock };
            delete (currentBlockForHash as any).blockHash;

            if (currentBlock.blockHash !== this.calculateBlockHash(currentBlockForHash)) {
                console.error(`Block ${currentBlock.index} hash is invalid.`);
                return false;
            }

            if (currentBlock.previousBlockHash !== previousBlock.blockHash) {
                console.error(`Chain link broken at block ${currentBlock.index}.`);
                return false;
            }

            if (new Date(currentBlock.timestamp) < new Date(previousBlock.timestamp)) {
                console.error(`Invalid timestamp at block ${currentBlock.index}.`);
                return false;
            }
        }
        return true;
    }

    public async getChain(): Promise<Block[]> {
        const dbBlocks = await prisma.blocks.findMany({ orderBy: { index: 'asc' } });
        return dbBlocks.map(this.mapDbBlockToBlock);
    }

    public async getBlockByIndex(index: number): Promise<Block | null> {
        const dbBlock = await prisma.blocks.findUnique({ where: { index } });
        return dbBlock ? this.mapDbBlockToBlock(dbBlock) : null;
    }

    private mapDbBlockToBlock(dbBlock: any): Block {
        return {
            index: dbBlock.index,
            timestamp: dbBlock.timestamp.toISOString(),
            data: dbBlock.data as BlockData,
            previousBlockHash: dbBlock.previous_block_hash, // Corrigido
            blockHash: dbBlock.block_hash // Corrigido
        };
    }
}
