import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LocaleService } from '../../services/locale.service';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import { FulfillWishDialogComponent } from '../fulfill-wish-dialog/fulfill-wish-dialog.component';
import { DeleteWishDialogComponent } from '../delete-wish-dialog/delete-wish-dialog.component';
import { DeleteReflectionDialogComponent } from '../delete-reflection-dialog/delete-reflection-dialog.component';
import { LeaveConfirmDialogComponent } from '../leave-confirm-dialog/leave-confirm-dialog.component';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        TranslatePipe,
        ShareModalComponent,
        FulfillWishDialogComponent,
        DeleteWishDialogComponent,
        DeleteReflectionDialogComponent,
        LeaveConfirmDialogComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
    public readonly localeService = inject(LocaleService);
}
