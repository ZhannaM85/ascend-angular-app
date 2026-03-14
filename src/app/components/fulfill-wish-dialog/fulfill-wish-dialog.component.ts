import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishStoreService } from '../../services/wish-store.service';
import { FulfillDialogService } from '../../services/fulfill-dialog.service';

@Component({
    selector: 'app-fulfill-wish-dialog',
    imports: [ReactiveFormsModule],
    templateUrl: './fulfill-wish-dialog.component.html',
    styleUrl: './fulfill-wish-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FulfillWishDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly store = inject(WishStoreService);
    private readonly dialog = inject(FulfillDialogService);
    private readonly router = inject(Router);

    readonly wishToFulfill = this.dialog.wishToFulfill;

    readonly form = this.fb.nonNullable.group({
        fulfilledDate: [new Date().toISOString().slice(0, 10), Validators.required],
        note: ['']
    });

    constructor() {
        effect(() => {
            const wish = this.wishToFulfill();
            if (wish) {
                this.form.reset({
                    fulfilledDate: new Date().toISOString().slice(0, 10),
                    note: ''
                });
            }
        });
    }

    close(): void {
        this.dialog.close();
    }

    save(): void {
        const wish = this.wishToFulfill();
        if (!wish || this.form.invalid) return;
        const v = this.form.getRawValue();
        const dateMs = new Date(v.fulfilledDate).getTime();
        this.store.markWishFulfilled(wish.id, dateMs, v.note || undefined);
        this.dialog.close();
        this.router.navigate(['/fulfilled']);
    }
}
