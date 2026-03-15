export interface Wish {
    id: string;
    title: string;
    description?: string;
    /** Optional image as JPEG data URL (compressed for storage). */
    imageDataUrl?: string;
    createdAt: number;
    fulfilled?: boolean;
    fulfilledDate?: number;
    fulfilledNote?: string;
}
