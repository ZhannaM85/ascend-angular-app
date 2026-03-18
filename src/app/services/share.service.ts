import { Injectable, signal } from '@angular/core';
import type { Commitment } from '../models/commitment.model';
import type { Wish } from '../models/wish.model';

export interface ShareContext {
    wish: Wish;
    commitment: Commitment;
}

@Injectable({
    providedIn: 'root'
})
export class ShareService {
    readonly shareState = signal<ShareContext | null>(null);

    /**
     * Opens the share modal for the given wish and commitment.
     *
     * @param wish - The wish to share.
     * @param commitment - The commitment to share.
     */
    open(wish: Wish, commitment: Commitment): void {
        this.shareState.set({ wish, commitment });
    }

    /**
     * Closes the share modal.
     */
    close(): void {
        this.shareState.set(null);
    }
}
