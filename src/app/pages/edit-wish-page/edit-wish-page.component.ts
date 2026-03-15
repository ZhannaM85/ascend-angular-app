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
import { WishStoreService } from '../../services/wish-store.service';
import { ImageCompressionService } from '../../services/image-compression.service';

@Component({
    selector: 'app-edit-wish-page',
    imports: [ReactiveFormsModule, RouterLink],
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

    readonly idParam = toSignal(
        this.route.paramMap.pipe(map((p) => p.get('id'))),
        { initialValue: undefined }
    );

    readonly wish = computed(() => {
        const id = this.idParam();
        return id ? this.store.getWish(id) : undefined;
    });

    readonly commitment = computed(() => {
        const w = this.wish();
        return w ? this.store.getCommitmentForWish(w.id) : undefined;
    });

    readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(1)]],
        description: [''],
        commitmentTitle: ['', [Validators.required, Validators.minLength(1)]],
        duration: [10, [Validators.required, Validators.min(1), Validators.max(365)]],
        commitmentStartDate: [new Date().toISOString().slice(0, 10), [Validators.required]]
    });

    private readonly hasPatched = signal(false);
    readonly imageDataUrl = signal<string | null>(null);
    readonly imageError = signal<string | null>(null);
    readonly imageCompressing = signal(false);

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
                        commitmentStartDate: new Date(c.startDate).toISOString().slice(0, 10)
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

    get hasCommitment(): boolean {
        return this.commitment() != null;
    }

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
            this.imageError.set('Could not process image. Try a different file.');
        } finally {
            this.imageCompressing.set(false);
        }
    }

    removeImage(): void {
        this.imageDataUrl.set(null);
        this.imageError.set(null);
    }

    onSubmit(): void {
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
