import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishStoreService } from '../../services/wish-store.service';
import { ImageCompressionService } from '../../services/image-compression.service';

function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

@Component({
    selector: 'app-create-wish-page',
    imports: [ReactiveFormsModule],
    templateUrl: './create-wish-page.component.html',
    styleUrl: './create-wish-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWishPageComponent {
    private readonly fb = inject(FormBuilder);
    private readonly store = inject(WishStoreService);
    private readonly router = inject(Router);
    private readonly imageCompression = inject(ImageCompressionService);

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
        this.router.navigate(['/wish', wish.id]);
    }
}
