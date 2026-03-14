export interface Commitment {
    id: string;
    wishId: string;
    title: string;
    duration: number;
    startDate: number;
    lastCheckIn?: number;
    streak: number;
    completed: boolean;
}
