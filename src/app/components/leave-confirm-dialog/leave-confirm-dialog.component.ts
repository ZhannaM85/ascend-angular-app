import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LeaveConfirmDialogService } from '../../services/leave-confirm-dialog.service';

@Component({
    selector: 'app-leave-confirm-dialog',
    imports: [TranslatePipe],
    templateUrl: './leave-confirm-dialog.component.html',
    styleUrl: './leave-confirm-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveConfirmDialogComponent {
    private readonly dialog = inject(LeaveConfirmDialogService);

    public readonly visible = this.dialog.visible;

    public readonly message = this.dialog.message;

    /**
     * Confirms the user wants to leave.
     */
    public confirmLeave(): void {
        this.dialog.confirmLeave();
    }

    /**
     * Cancels and keeps the user on the current page.
     */
    public cancel(): void {
        this.dialog.cancel();
    }
}
