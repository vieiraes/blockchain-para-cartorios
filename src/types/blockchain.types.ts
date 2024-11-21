export interface Block {
    index: number;
    timestamp: string;
    data: any;
    previousHash: string;
    hash: string;
}

export interface BlockchainResponse {
    success: boolean;
    data?: Block | Block[];
    error?: string;
}

interface BlockData {
    id: string;          // ID único do certificado
    timestamp: string;   // Quando foi certificado
    issuer: string;      // Quem certificou
    content: {           // Conteúdo certificado
        data: any;       // Dados flexíveis
        hash: string;    // Hash do dado original
        type: string;    // Tipo do dado (string, number, etc)
    }[]
}