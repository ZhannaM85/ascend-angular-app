import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LeaveConfirmDialogService } from '../../services/leave-confirm-dialog.service';

@Component({
    selector: 'app-leave-confirm-dialog',
    templateUrl: './leave-confirm-dialog.component.html',
    styleUrl: './leave-confirm-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveConfirmDialogComponent {
    private readonly dialog = inject(LeaveConfirmDialogService);

    readonly visible = this.dialog.visible;
    readonly message = this.dialog.message;

    confirmLeave(): void {
        this.dialog.confirmLeave();
    }

    cancel(): void {
        this.dialog.cancel();
    }
}
