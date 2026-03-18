import { Injectable, signal } from '@angular/core';
import type { Wish } from '../models/wish.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteWishDialogService {
    public readonly wishToDelete = signal<Wish | null>(null);

    /**
     * Opens the delete wish dialog for the given wish.
     *
     * @param wish - The wish to delete.
     */
    public open(wish: Wish): void {
        this.wishToDelete.set(wish);
    }

    /**
     * Closes the delete wish dialog.
     */
    public close(): void {
        this.wishToDelete.set(null);
    }
}
