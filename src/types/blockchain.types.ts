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

export type BlockData = {
    data: any;
}