import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { Commitment } from '../../models/commitment.model';
import type { Wish } from '../../models/wish.model';
import { WishStoreService } from '../../services/wish-store.service';
import { ShareService } from '../../services/share.service';

@Component({
    selector: 'app-fulfilled-wishes-page',
    imports: [TranslatePipe],
    templateUrl: './fulfilled-wishes-page.component.html',
    styleUrl: './fulfilled-wishes-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FulfilledWishesPageComponent {
    private readonly store = inject(WishStoreService);
    private readonly shareService = inject(ShareService);

    readonly fulfilledWishes = this.store.fulfilledWishes;

    readonly listWithCommitments = computed(() => {
        return this.fulfilledWishes().map((wish) => ({
            wish,
            commitment: this.store.getCommitmentForWish(wish.id)
        }));
    });

    formatDate(ts: number | undefined): string {
        if (ts == null) return '';
        return new Date(ts).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    shareStory(item: { wish: Wish; commitment: Commitment | undefined }): void {
        if (item.commitment) {
            this.shareService.open(item.wish, item.commitment);
        }
    }
}
