import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { WishStoreService } from '../../services/wish-store.service';
import { ImageCompressionService } from '../../services/image-compression.service';

/**
 * Formats a timestamp as YYYY-MM-DD in local timezone (for date inputs).
 *
 * @param ts - Timestamp in milliseconds.
 * @returns Date string in YYYY-MM-DD format.
 */
function toLocalDateString(ts: number): string {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

@Component({
    selector: 'app-edit-wish-page',
    imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
    templateUrl: './edit-wish-page.component.html',
    styleUrl: './edit-wish-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWishPageComponent {
    private readonly fb = inject(FormBuilder);

    private readonly store = inject(WishStoreService);

    private readonly router = inject(Router);

    private readonly route = inject(ActivatedRoute);

    private readonly imageCompression = inject(ImageCompressionService);

    private readonly translate = inject(TranslateService);

    public readonly idParam = toSignal(
        this.route.paramMap.pipe(map((p) => p.get('id'))),
        { initialValue: undefined }
    );

    public readonly wish = computed(() => {
        const id = this.idParam();
        return id ? this.store.getWish(id) : undefined;
    });

    public readonly commitment = computed(() => {
        const w = this.wish();
        return w ? this.store.getCommitmentForWish(w.id) : undefined;
    });

    public readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(1)]],
        description: [''],
        commitmentTitle: ['', [Validators.required, Validators.minLength(1)]],
        duration: [10, [Validators.required, Validators.min(1), Validators.max(365)]],
        commitmentStartDate: [new Date().toISOString().slice(0, 10), [Validators.required]]
    });

    private readonly hasPatched = signal(false);

    public readonly imageDataUrl = signal<string | null>(null);

    public readonly imageError = signal<string | null>(null);

    public readonly imageCompressing = signal(false);

    constructor() {
        effect(() => {
            const w = this.wish();
            const c = this.commitment();
            if (w && !this.hasPatched()) {
                this.form.patchValue({
                    title: w.title,
                    description: w.description ?? ''
                });
                this.imageDataUrl.set(w.imageDataUrl ?? null);
                if (c) {
                    this.form.patchValue({
                        commitmentTitle: c.title,
                        duration: c.duration,
                        commitmentStartDate: toLocalDateString(c.startDate)
                    });
                } else {
                    this.form.controls.commitmentTitle.clearValidators();
                    this.form.controls.duration.clearValidators();
                    this.form.controls.commitmentStartDate.clearValidators();
                    this.form.controls.commitmentTitle.updateValueAndValidity();
                    this.form.controls.duration.updateValueAndValidity();
                    this.form.controls.commitmentStartDate.updateValueAndValidity();
                }
                this.hasPatched.set(true);
            }
        });
    }

    /**
     * Whether the wish has an associated commitment.
     */
    public get hasCommitment(): boolean {
        return this.commitment() != null;
    }

    /**
     * Handles image file selection and compression.
     *
     * @param event - The file input change event.
     */
    public async onImageSelected(event: Event): Promise<void> {
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
    public removeImage(): void {
        this.imageDataUrl.set(null);
        this.imageError.set(null);
    }

    /**
     * Saves wish and commitment changes, then navigates to wish details.
     */
    public onSubmit(): void {
        if (this.form.invalid) return;
        const wishId = this.idParam();
        if (!wishId) return;
        const v = this.form.getRawValue();
        this.store.updateWish(wishId, {
            title: v.title,
            description: v.description || undefined,
            imageDataUrl: this.imageDataUrl()
        });
        if (this.hasCommitment) {
            const startDateMs = new Date(v.commitmentStartDate).getTime();
            this.store.updateCommitment(wishId, {
                title: v.commitmentTitle,
                duration: v.duration,
                startDate: startDateMs
            });
        }
        this.router.navigate(['/wish', wishId]);
    }
}
