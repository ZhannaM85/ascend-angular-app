import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import type { CreateWishPageComponent } from '../pages/create-wish-page/create-wish-page.component';
import { LeaveConfirmDialogService } from '../services/leave-confirm-dialog.service';

export const canDeactivateCreateWish: CanDeactivateFn<CreateWishPageComponent> = (component) => {
    if (!component.hasUnsavedChanges()) return true;
    return inject(LeaveConfirmDialogService).showConfirm(
        inject(TranslateService).instant('leaveConfirmMessage.unsavedChanges')
    );
};
