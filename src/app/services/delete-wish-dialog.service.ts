import { Injectable, signal } from '@angular/core';
import type { Wish } from '../models/wish.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteWishDialogService {
    readonly wishToDelete = signal<Wish | null>(null);

    open(wish: Wish): void {
        this.wishToDelete.set(wish);
    }

    close(): void {
        this.wishToDelete.set(null);
    }
}
