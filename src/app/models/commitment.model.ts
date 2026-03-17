export interface Commitment {
    id: string;
    wishId: string;
    title: string;
    duration: number;
    startDate: number;
    /**
     * Start-of-day timestamps (local time) representing checked-in days.
     * This allows users to mark/unmark past days without shifting progress.
     */
    checkIns?: number[];
    lastCheckIn?: number;
    streak: number;
    completed: boolean;
}
