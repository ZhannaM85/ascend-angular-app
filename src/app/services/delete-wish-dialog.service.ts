import { Injectable, signal } from '@angular/core';
import type { Wish } from '../models/wish.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteWishDialogService {
    readonly wishToDelete = signal<Wish | null>(null);

    /**
     * Opens the delete wish dialog for the given wish.
     *
     * @param wish - The wish to delete.
     */
    open(wish: Wish): void {
        this.wishToDelete.set(wish);
    }

    /**
     * Closes the delete wish dialog.
     */
    close(): void {
        this.wishToDelete.set(null);
    }
}
