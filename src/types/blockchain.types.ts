export interface CertificateContent {
    data: any;
    type: string;
    hash: string;
}

export interface BlockData {
    id: string;
    timestamp: string;
    issuer: string;
    contents: CertificateContent[];
}

export interface Block {
    index: number;
    timestamp: string;
    data: BlockData;
    previousBlockHash: string;
    blockHash: string;
}