import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WishStoreService } from '../../services/wish-store.service';
import { DeleteReflectionDialogService } from '../../services/delete-reflection-dialog.service';

@Component({
    selector: 'app-delete-reflection-dialog',
    templateUrl: './delete-reflection-dialog.component.html',
    styleUrl: './delete-reflection-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteReflectionDialogComponent {
    private readonly store = inject(WishStoreService);
    private readonly dialog = inject(DeleteReflectionDialogService);

    readonly reflectionToDelete = this.dialog.reflectionToDelete;

    close(): void {
        this.dialog.close();
    }

    formatDate(ts: number): string {
        return new Date(ts).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    confirmDelete(): void {
        const reflection = this.reflectionToDelete();
        if (!reflection) return;
        this.store.deleteReflection(reflection.id);
        this.dialog.close();
    }
}
