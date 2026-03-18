import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import type { CreateWishPageComponent } from '../pages/create-wish-page/create-wish-page.component';
import { LeaveConfirmDialogService } from '../services/leave-confirm-dialog.service';

/**
 * Route guard that prompts before leaving the create wish page with unsaved changes.
 *
 * @param component - The CreateWishPageComponent instance.
 * @returns True if can leave, or Promise resolving to user's choice.
 */
export const canDeactivateCreateWish: CanDeactivateFn<CreateWishPageComponent> = (component) => {
    if (!component.hasUnsavedChanges()) return true;
    return inject(LeaveConfirmDialogService).showConfirm(
        inject(TranslateService).instant('leaveConfirmMessage.unsavedChanges')
    );
};
