import { v4 as uuid } from 'uuid';
import { createHash } from 'crypto';
import { Issuer, IssuerResponse } from '../types/issuer.types';
import * as bip39 from 'bip39';

export class IssuerManager {
    private issuers: Issuer[] = [];

    private generateSecretWords(): string[] {
        // Gerando 16 palavras para garantir que temos pelo menos 13
        const mnemonic = bip39.generateMnemonic(192); // 192 bits = 18 palavras
        const words = mnemonic.split(' ').slice(0, 13); // Pegando exatamente 13
        
        // Verificação de segurança
        if (words.length !== 13) {
            throw new Error('Failed to generate 13 words');
        }
        
        return words.map(word => word.toUpperCase());
    }

    private calculateHash(words: string[]): string {
        return createHash('sha256')
            .update(words.join(''))
            .digest('hex');
    }

    public createIssuer(name: string): IssuerResponse {
        const secretWords = this.generateSecretWords();
        const privateKeyHash = this.calculateHash(secretWords);

        const issuer: Issuer = {
            id: uuid(),
            name,
            privateKeyHash,
            secretWords,
            isAccredited: false,
            createdAt: new Date().toISOString()
        };

        this.issuers.push(issuer);

        return {
            id: issuer.id,
            name: issuer.name,
            secretWords: issuer.secretWords,
            isAccredited: issuer.isAccredited,
            createdAt: issuer.createdAt
        };
    }

    public accreditIssuer(id: string, providedHash: string): boolean {
        const issuer = this.issuers.find(i => i.id === id);
        if (!issuer) {
            throw new Error('Issuer not found');
        }

        if (issuer.privateKeyHash === providedHash) {
            issuer.isAccredited = true;
            return true;
        }
        return false;
    }

    public isIssuerAccredited(id: string): boolean {
        const issuer = this.issuers.find(i => i.id === id);
        return issuer?.isAccredited || false;
    }

    public getIssuer(id: string): IssuerResponse | null {
        const issuer = this.issuers.find(i => i.id === id);
        if (!issuer) return null;

        return {
            id: issuer.id,
            name: issuer.name,
            secretWords: issuer.secretWords,
            isAccredited: issuer.isAccredited,
            createdAt: issuer.createdAt
        };
    }

    public getAllIssuers(): IssuerResponse[] {
        return this.issuers.map(issuer => ({
            id: issuer.id,
            name: issuer.name,
            secretWords: issuer.secretWords,
            isAccredited: issuer.isAccredited,
            createdAt: issuer.createdAt
        }));
    }
}


