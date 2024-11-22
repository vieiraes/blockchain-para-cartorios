import { Request, Response } from 'express';
import { Blockchain } from '../core/Blockchain.class';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { rmSync } from 'fs';

interface CertificateContent {
    data: any;
    type: string;
    contentHash: string;
}

interface BlockData {
    id: string;
    timestamp: string;
    issuer: string;
    content: CertificateContent[];
}

class BlockchainController {
    private blockchain: Blockchain;

    constructor() {
        this.blockchain = new Blockchain();
    }

    private validateContent(content: any[]): { isValid: boolean; error?: string } {
        if (!Array.isArray(content)) {
            return { isValid: false, error: 'Content must be an array' };
        }

        for (const item of content) {rmSync
            if (!item.data) {
                return { isValid: false, error: 'Each content item must have data' };
            }

            // Gera hash dos dados para validação
            const dataHash = createHash('sha256')
                .update(JSON.stringify(item.data))
                .digest('hex');

            if (item.hash && item.hash !== dataHash) {
                return { isValid: false, error: 'Content hash mismatch' };
            }
        }

        return { isValid: true };
    }

    public getBlocks = (req: Request, res: Response) => {
        try {
            const chain = this.blockchain.getChain();
            // Invertendo a ordem para decrescente
            const reversedChain = [...chain].reverse();
            res.status(200).json(reversedChain);
        } catch (error) {
            console.error('Error getting blocks:', error);
            res.status(500).json({ error: 'Failed to get blockchain' });
        }
    }

    public addBlock = (req: Request, res: Response) => {
        try {
            const { content, issuer } = req.body;

            // Validações básicas
            if (!content || !issuer) {
                return res.status(400).json({ error: 'Content and issuer are required' });
            }

            // Valida estrutura do conteúdo
            const contentValidation = this.validateContent(content);
            if (!contentValidation.isValid) {
                return res.status(400).json({ error: contentValidation.error });
            }

            // Prepara dados do bloco
            const blockData: BlockData = {
                id: uuid(),
                timestamp: new Date().toISOString(),
                issuer,
                content: content.map(item => ({
                    data: item.data,
                    type: typeof item.data,
                    hash: createHash('sha256')
                        .update(JSON.stringify(item.data))
                        .digest('hex')
                }))
            };

            // Valida timestamp
            if (new Date(blockData.timestamp) > new Date()) {
                return res.status(400).json({ error: 'Invalid timestamp - future date' });
            }

            const newBlock = this.blockchain.addBlock(blockData);
            res.status(201).json(newBlock);

        } catch (error) {
            console.error('Error adding block:', error);
            res.status(500).json({ error: 'Failed to add block' });
        }
    }

    public validateChain = (req: Request, res: Response) => {
        try {
            const isValid = this.blockchain.isChainValid();
            res.status(200).json({ isValid });
        } catch (error) {
            console.error('Error validating chain:', error);
            res.status(500).json({ error: 'Failed to validate chain' });
        }
    }

    public getBlockByIndex = (req: Request, res: Response) => {
        try {
            const index = parseInt(req.params.index);
            
            if (isNaN(index)) {
                return res.status(400).json({ error: 'Invalid block index' });
            }

            const allBlocks = this.blockchain.getChain();
            const block = allBlocks.find(b => b.index === index);
            
            if (!block) {
                return res.status(404).json({ 
                    error: 'Block not found',
                    requestedIndex: index
                });
            }

            res.status(200).json(block);
        } catch (error) {
            console.error('Error getting block:', error);
            res.status(500).json({ error: 'Failed to get block' });
        }
    }


}

export default new BlockchainController();