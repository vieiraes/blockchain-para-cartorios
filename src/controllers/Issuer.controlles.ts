import { Request, Response } from 'express';
import { IssuerManager } from '../core/Issuer.class';
import { createHash } from 'crypto';


class IssuerController {
    private issuerManager: IssuerManager;

    constructor() {
        this.issuerManager = new IssuerManager();
    }

    public createIssuer = (req: Request, res: Response) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const issuer = this.issuerManager.createIssuer(name);
            res.status(201).json(issuer);
        } catch (error) {
            console.error('Error creating issuer:', error);
            res.status(500).json({ error: 'Failed to create issuer' });
        }
    }

    public accreditIssuer = (req: Request, res: Response) => {
        try {
            const { id, providedHash } = req.body;

            if (!id || !providedHash) {
                return res.status(400).json({ error: 'ID and hash are required' });
            }

            const isAccredited = this.issuerManager.accreditIssuer(id, providedHash);

            if (isAccredited) {
                res.status(200).json({ message: 'Issuer successfully accredited' });
            } else {
                res.status(400).json({ error: 'Invalid hash provided' });
            }
        } catch (error) {
            console.error('Error accrediting issuer:', error);
            res.status(500).json({ error: 'Failed to accredit issuer' });
        }
    }

    public getIssuer = (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const issuer = this.issuerManager.getIssuer(id);

            if (!issuer) {
                return res.status(404).json({ error: 'Issuer not found' });
            }

            res.status(200).json(issuer);
        } catch (error) {
            console.error('Error getting issuer:', error);
            res.status(500).json({ error: 'Failed to get issuer' });
        }
    }

    public getAllIssuers = (req: Request, res: Response) => {
        try {
            const issuers = this.issuerManager.getAllIssuers();
            res.status(200).json(issuers);
        } catch (error) {
            console.error('Error getting issuers:', error);
            res.status(500).json({ error: 'Failed to get issuers' });
        }
    }

    public generateHash = (req: Request, res: Response) => {
        try {
            const { words } = req.body;

            if (!words || !Array.isArray(words) || words.length !== 13) {
                return res.status(400).json({
                    error: 'Invalid input. Provide an array with exactly 13 words'
                });
            }

            const hash = createHash('sha256')
                .update(words.join(''))
                .digest('hex');

            res.status(200).json({
                providedWords: words,
                generatedHash: hash
            });
        } catch (error) {
            console.error('Error generating hash:', error);
            res.status(500).json({ error: 'Failed to generate hash' });
        }
    }
}



export default new IssuerController();



