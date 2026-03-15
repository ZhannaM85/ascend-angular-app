import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishStoreService } from '../../services/wish-store.service';

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

    readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(1)]],
        description: [''],
        commitmentTitle: ['', [Validators.required, Validators.minLength(1)]],
        duration: [10, [Validators.required, Validators.min(1), Validators.max(365)]],
        commitmentStartDate: [getTodayDateString(), [Validators.required]]
    });

    onSubmit(): void {
        if (this.form.invalid) return;
        const v = this.form.getRawValue();
        const startDateMs = new Date(v.commitmentStartDate).getTime();
        const wish = this.store.addWish(
            v.title,
            v.commitmentTitle,
            v.duration,
            v.description || undefined,
            startDateMs
        );
        this.router.navigate(['/wish', wish.id]);
    }
}
