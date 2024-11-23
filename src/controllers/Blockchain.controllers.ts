import { Request, Response } from 'express';
import { Blockchain } from '../core/Blockchain.class';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { rmSync } from 'fs';

export interface CertificateContent {
    data: any;
    type: string;
    contentHash: string;
}

export interface BlockData {
    id: string;
    timestamp: string;
    issuer: string;
    contents: CertificateContent[];
}

class BlockchainController {
    private blockchain: Blockchain;

    constructor() {
        this.blockchain = new Blockchain();
    }

    private validateContents(contents: any[]): { isValid: boolean; error?: string } {
        if (!Array.isArray(contents)) {
            return { isValid: false, error: 'Content must be an array' };
        }

        for (const item of contents) {
            rmSync
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

    private addContentCount(block: any) {
        // Contando os itens dentro do array data do primeiro item de contents
        const contentsData = block.data.contents[0].data;
        const count = Array.isArray(contentsData) ? contentsData.length : 1;

        return {
            ...block,
            contentCount: count
        };
    }

    public getBlocks = (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const chain = this.blockchain.getChain();

            const reversedChain = [...chain].reverse()
                .map(block => this.addContentCount(block));

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const paginatedBlocks = reversedChain.slice(startIndex, endIndex);
            const totalBlocks = chain.length;
            const totalPages = Math.ceil(totalBlocks / limit);

            res.status(200).json({
                blocks: paginatedBlocks,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBlocks,
                    limit,
                    hasNext: page < totalPages,
                    hasPrevious: page > 1
                }
            });
        } catch (error) {
            console.error('Error getting blocks:', error);
            res.status(500).json({ error: 'Failed to get blockchain' });
        }
    }

    public addBlock = (req: Request, res: Response) => {
        try {
            const { contents, issuer } = req.body;

            // Validações básicas
            if (!contents || !issuer) {
                return res.status(400).json({ error: 'Contents and issuer are required' });
            }

            // Valida estrutura do conteúdo
            const contentValidation = this.validateContents(contents);
            if (!contentValidation.isValid) {
                return res.status(400).json({ error: contentValidation.error });
            }

            // Prepara dados do bloco
            const blockData: BlockData = {
                id: uuid(),
                timestamp: new Date().toISOString(),
                issuer,
                contents: contents.map(item => ({
                    data: item.data,
                    type: typeof item.data,
                    contentHash: createHash('sha256')
                        .update(JSON.stringify(item.data))
                        .digest('hex')
                }))
            };

            // Valida timestamp
            if (new Date(blockData.timestamp) > new Date()) {
                return res.status(400).json({ error: 'Invalid timestamp - future date' });
            }

            const newBlock = this.blockchain.addBlock(blockData);

            // Adiciona contentCount ao response
            const response = {
                ...newBlock,
                contentCount: contents[0].data.length || 1
            };

            res.status(201).json(response);
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

            const block = this.blockchain.getBlockByIndex(index);

            if (!block) {
                return res.status(404).json({ error: 'Block not found' });
            }

            const blockWithCount = this.addContentCount(block);
            res.status(200).json(blockWithCount);

        } catch (error) {
            console.error('Error getting block:', error);
            res.status(500).json({ error: 'Failed to get block' });
        }
    }

    public getLedger = (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const chain = this.blockchain.getChain();

            // Mapeia apenas os dados necessários
            const ledgerData = chain.map(block => ({
                index: block.index,
                contentCount: block.data.contents[0].data.length || 1,
                blockHash: block.blockHash
            }));

            const reversedLedger = [...ledgerData].reverse();

            // Paginação
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedLedger = reversedLedger.slice(startIndex, endIndex);

            const totalBlocks = chain.length;
            const totalPages = Math.ceil(totalBlocks / limit);

            res.status(200).json({
                ledger: {
                    blocks: paginatedLedger
                },
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBlocks,
                    limit,
                    hasNext: page < totalPages,
                    hasPrevious: page > 1
                }
            });
        } catch (error) {
            console.error('Error getting ledger:', error);
            res.status(500).json({ error: 'Failed to get ledger' });
        }
    }


}

export default new BlockchainController();