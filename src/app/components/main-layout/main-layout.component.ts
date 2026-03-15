import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import { FulfillWishDialogComponent } from '../fulfill-wish-dialog/fulfill-wish-dialog.component';
import { DeleteWishDialogComponent } from '../delete-wish-dialog/delete-wish-dialog.component';
import { DeleteReflectionDialogComponent } from '../delete-reflection-dialog/delete-reflection-dialog.component';

@Component({
    selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        ShareModalComponent,
        FulfillWishDialogComponent,
        DeleteWishDialogComponent,
        DeleteReflectionDialogComponent
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {}
