import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Commitment } from '../../models/commitment.model';
import type { Wish } from '../../models/wish.model';
import { ShareService } from '../../services/share.service';
import { WishStoreService } from '../../services/wish-store.service';
import { DeleteWishDialogService } from '../../services/delete-wish-dialog.service';
import { WishCardComponent } from '../../components/wish-card/wish-card.component';

@Component({
    selector: 'app-wishes-page',
    imports: [RouterLink, WishCardComponent],
    templateUrl: './wishes-page.component.html',
    styleUrl: './wishes-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishesPageComponent {
    private readonly store = inject(WishStoreService);
    private readonly shareService = inject(ShareService);
    private readonly deleteDialog = inject(DeleteWishDialogService);

    readonly activeWishes = this.store.activeWishes;

    readonly wishWithCommitment = computed(() => {
        return this.activeWishes().map((wish) => ({
            wish,
            commitment: this.store.getCommitmentForWish(wish.id)
        }));
    });

    onShare(item: { wish: Wish; commitment: Commitment | undefined }): void {
        if (item.commitment) {
            this.shareService.open(item.wish, item.commitment);
        }
    }

    onDelete(item: { wish: Wish }): void {
        this.deleteDialog.open(item.wish);
    }
}
