import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LeaveConfirmDialogService {
    public readonly visible = signal(false);

    public readonly message = signal('');

    private resolveCallback: ((value: boolean) => void) | null = null;

    /**
     * Shows the leave confirmation dialog. Returns a promise that resolves to true if the user
     * confirms leave, false if they cancel.
     *
     * @param message - The confirmation message to display.
     * @returns Promise resolving to true if user confirms, false if cancelled.
     */
    public showConfirm(message: string): Promise<boolean> {
        this.message.set(message);
        this.visible.set(true);
        return new Promise<boolean>((resolve) => {
            this.resolveCallback = resolve;
        });
    }

    /**
     * Confirms the user wants to leave; resolves the promise with true.
     */
    public confirmLeave(): void {
        if (this.resolveCallback) {
            this.resolveCallback(true);
            this.resolveCallback = null;
        }
        this.visible.set(false);
    }

    /**
     * Cancels the dialog; resolves the promise with false.
     */
    public cancel(): void {
        if (this.resolveCallback) {
            this.resolveCallback(false);
            this.resolveCallback = null;
        }
        this.visible.set(false);
    }
}
