export interface Wish {
    id: string;
    title: string;
    description?: string;
    createdAt: number;
    fulfilled?: boolean;
    fulfilledDate?: number;
    fulfilledNote?: string;
}
