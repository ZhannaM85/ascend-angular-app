import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { WishStoreService } from '../../services/wish-store.service';
import { ImageCompressionService } from '../../services/image-compression.service';
import { LeaveConfirmDialogService } from '../../services/leave-confirm-dialog.service';

/**
 * Returns today's date as YYYY-MM-DD in UTC (for date input default).
 *
 * @returns Date string in YYYY-MM-DD format.
 */
function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

@Component({
    selector: 'app-create-wish-page',
    imports: [ReactiveFormsModule, TranslatePipe],
    templateUrl: './create-wish-page.component.html',
    styleUrl: './create-wish-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWishPageComponent {
    private readonly fb = inject(FormBuilder);

    private readonly store = inject(WishStoreService);

    private readonly router = inject(Router);

    private readonly imageCompression = inject(ImageCompressionService);

    private readonly leaveConfirm = inject(LeaveConfirmDialogService);

    private readonly translate = inject(TranslateService);

    readonly imageDataUrl = signal<string | null>(null);

    readonly imageError = signal<string | null>(null);

    readonly imageCompressing = signal(false);

    readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(1)]],
        description: [''],
        commitmentTitle: ['', [Validators.required, Validators.minLength(1)]],
        duration: [10, [Validators.required, Validators.min(1), Validators.max(365)]],
        commitmentStartDate: [getTodayDateString(), [Validators.required]]
    });

    /**
     * Handles image file selection and compression.
     *
     * @param event - The file input change event.
     */
    async onImageSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        this.imageError.set(null);
        if (!file) return;
        this.imageCompressing.set(true);
        try {
            const dataUrl = await this.imageCompression.compress(file);
            this.imageDataUrl.set(dataUrl);
        } catch {
            this.imageError.set(this.translate.instant('createWishPage.imageError'));
        } finally {
            this.imageCompressing.set(false);
        }
    }

    /**
     * Clears the selected image.
     */
    removeImage(): void {
        this.imageDataUrl.set(null);
        this.imageError.set(null);
    }

    /**
     * Returns true if the form or image has unsaved changes.
     *
     * @returns True if there are unsaved changes.
     */
    hasUnsavedChanges(): boolean {
        return this.form.dirty || this.imageDataUrl() !== null;
    }

    /**
     * Handles back navigation with unsaved changes confirmation.
     */
    async onBackClick(): Promise<void> {
        if (this.hasUnsavedChanges()) {
            const leave = await this.leaveConfirm.showConfirm(
                this.translate.instant('leaveConfirmMessage.unsavedChanges')
            );
            if (leave) {
                this.router.navigate(['/wishes']);
            }
        } else {
            this.router.navigate(['/wishes']);
        }
    }

    /**
     * Creates the wish and commitment, then navigates to wish details.
     */
    onSubmit(): void {
        if (this.form.invalid) return;
        const v = this.form.getRawValue();
        const startDateMs = new Date(v.commitmentStartDate).getTime();
        const wish = this.store.addWish(
            v.title,
            v.commitmentTitle,
            v.duration,
            v.description || undefined,
            startDateMs,
            this.imageDataUrl() ?? undefined
        );
        this.form.markAsPristine();
        this.imageDataUrl.set(null);
        this.router.navigate(['/wish', wish.id]);
    }
}
