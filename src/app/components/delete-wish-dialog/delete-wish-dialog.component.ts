import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WishStoreService } from '../../services/wish-store.service';
import { DeleteWishDialogService } from '../../services/delete-wish-dialog.service';

@Component({
    selector: 'app-delete-wish-dialog',
    imports: [TranslatePipe],
    templateUrl: './delete-wish-dialog.component.html',
    styleUrl: './delete-wish-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteWishDialogComponent {
    private readonly store = inject(WishStoreService);
    private readonly dialog = inject(DeleteWishDialogService);

    readonly wishToDelete = this.dialog.wishToDelete;

    /**
     * Closes the dialog without deleting.
     */
    close(): void {
        this.dialog.close();
    }

    /**
     * Deletes the wish and closes the dialog.
     */
    confirmDelete(): void {
        const wish = this.wishToDelete();
        if (!wish) return;
        this.store.deleteWish(wish.id);
        this.dialog.close();
    }
}
