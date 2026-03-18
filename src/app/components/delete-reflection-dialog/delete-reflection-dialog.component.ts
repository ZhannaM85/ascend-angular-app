import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WishStoreService } from '../../services/wish-store.service';
import { DeleteReflectionDialogService } from '../../services/delete-reflection-dialog.service';

@Component({
    selector: 'app-delete-reflection-dialog',
    imports: [TranslatePipe],
    templateUrl: './delete-reflection-dialog.component.html',
    styleUrl: './delete-reflection-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteReflectionDialogComponent {
    private readonly store = inject(WishStoreService);

    private readonly dialog = inject(DeleteReflectionDialogService);

    public readonly reflectionToDelete = this.dialog.reflectionToDelete;

    /**
     * Closes the dialog without deleting.
     */
    public close(): void {
        this.dialog.close();
    }

    /**
     * Formats a timestamp for display in the dialog.
     *
     * @param ts - Timestamp in milliseconds.
     * @returns Formatted date string.
     */
    public formatDate(ts: number): string {
        return new Date(ts).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Deletes the reflection and closes the dialog.
     */
    public confirmDelete(): void {
        const reflection = this.reflectionToDelete();
        if (!reflection) return;
        this.store.deleteReflection(reflection.id);
        this.dialog.close();
    }
}
