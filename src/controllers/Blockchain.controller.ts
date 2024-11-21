import { Request, Response } from 'express';
import { Blockchain } from '../core/Blockchain.class';

class BlockchainController {
    private blockchain: Blockchain;

    constructor() {
        this.blockchain = new Blockchain();
    }

    public getBlocks = (req: Request, res: Response) => {
        try {
            const chain = this.blockchain.getChain();
            res.status(200).json(chain);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get blockchain' });
        }
    }

    public addBlock = (req: Request, res: Response) => {
        try {
            const { data } = req.body;
            if (!data) {
                return res.status(400).json({ error: 'Data is required' });
            }

            const newBlock = this.blockchain.addBlock(data);
            res.status(201).json(newBlock);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add block' });
        }
    }

    public validateChain = (req: Request, res: Response) => {
        try {
            const isValid = this.blockchain.isChainValid();
            res.status(200).json({ isValid });
        } catch (error) {
            res.status(500).json({ error: 'Failed to validate chain' });
        }
    }
}

export default new BlockchainController();