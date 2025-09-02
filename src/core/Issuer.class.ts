import { v4 as uuid } from 'uuid';
import { createHash } from 'crypto';
import { Issuer, IssuerResponse } from '../types/issuer.types';
import * as bip39 from 'bip39';
import prisma from '../lib/prisma';

export class IssuerManager {

    private generateSecretWords(): string[] {
        const mnemonic = bip39.generateMnemonic(192); // 192 bits = 18 palavras
        const words = mnemonic.split(' ').slice(0, 13);
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

    public async createIssuer(name: string): Promise<IssuerResponse> {
        const secretWords = this.generateSecretWords();
        const privateKeyHash = this.calculateHash(secretWords);

        const issuer = await prisma.issuers.create({
            data: {
                id: uuid(),
                name,
                private_key_hash: privateKeyHash,
                is_accredited: false,
            }
        });

        return {
            id: issuer.id,
            name: issuer.name,
            secretWords: secretWords, // Apenas para o retorno da chamada de criação
            isAccredited: issuer.is_accredited,
            createdAt: issuer.created_at.toISOString()
        };
    }

    public async accreditIssuer(id: string, providedHash: string): Promise<boolean> {
        const issuer = await prisma.issuers.findUnique({ where: { id } });
        if (!issuer) {
            throw new Error('Issuer not found');
        }

        if (issuer.private_key_hash === providedHash) { // Corrigido
            await prisma.issuers.update({
                where: { id },
                data: { is_accredited: true }, // Corrigido
            });
            return true;
        }
        return false;
    }

    public async isIssuerAccredited(id: string): Promise<boolean> {
        const issuer = await prisma.issuers.findUnique({ where: { id } });
        return issuer?.is_accredited || false; // Corrigido
    }

    public async getIssuer(id: string): Promise<Omit<Issuer, 'secretWords' | 'privateKeyHash'> | null> {
        const issuer = await prisma.issuers.findUnique({ 
            where: { id },
        });
        if (!issuer) return null;

        return {
            id: issuer.id,
            name: issuer.name,
            isAccredited: issuer.is_accredited,
            createdAt: issuer.created_at.toISOString(),
        };
    }

    public async getAllIssuers(): Promise<Omit<Issuer, 'secretWords' | 'privateKeyHash'>[]> {
        const issuers = await prisma.issuers.findMany();

        return issuers.map(issuer => ({
            id: issuer.id,
            name: issuer.name,
            isAccredited: issuer.is_accredited,
            createdAt: issuer.created_at.toISOString(),
        }));
    }
}


