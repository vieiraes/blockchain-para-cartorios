export interface Issuer {
    id: string;
    name: string;
    privateKeyHash: string;
    secretWords: string[];
    isAccredited: boolean;
    createdAt: string;
}

export interface IssuerResponse {
    id: string;
    name: string;
    secretWords: string[];
    isAccredited: boolean;
    createdAt: string;
}

export interface AccreditationRequest {
    id: string;
    providedHash: string;
}