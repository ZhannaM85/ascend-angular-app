import { Injectable, signal } from '@angular/core';
import type { Wish } from '../models/wish.model';

@Injectable({
    providedIn: 'root'
})
export class FulfillDialogService {
    public readonly wishToFulfill = signal<Wish | null>(null);

    /**
     * Opens the fulfill dialog for the given wish.
     *
     * @param wish - The wish to fulfill.
     */
    public open(wish: Wish): void {
        this.wishToFulfill.set(wish);
    }

    /**
     * Closes the fulfill dialog.
     */
    public close(): void {
        this.wishToFulfill.set(null);
    }
}
