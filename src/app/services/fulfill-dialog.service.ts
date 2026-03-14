import { Injectable, signal } from '@angular/core';
import type { Wish } from '../models/wish.model';

@Injectable({
    providedIn: 'root'
})
export class FulfillDialogService {
    readonly wishToFulfill = signal<Wish | null>(null);

    open(wish: Wish): void {
        this.wishToFulfill.set(wish);
    }

    close(): void {
        this.wishToFulfill.set(null);
    }
}
