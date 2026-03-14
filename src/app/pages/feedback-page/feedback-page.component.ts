import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-feedback-page',
    imports: [ReactiveFormsModule],
    templateUrl: './feedback-page.component.html',
    styleUrl: './feedback-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackPageComponent {
    private readonly fb = inject(FormBuilder);
    private readonly http = inject(HttpClient);

    readonly form = this.fb.nonNullable.group({
        name: [''],
        email: [''],
        subject: ['Ascend app – feedback or question', Validators.required],
        message: ['', [Validators.required, Validators.minLength(10)]]
    });

    readonly status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
    readonly errorMessage = signal<string | null>(null);

    get isConfigured(): boolean {
        const id = environment.formspreeFormId;
        return id != null && id !== '' && id !== 'YOUR_FORMSPREE_FORM_ID';
    }

    onSubmit(): void {
        if (this.form.invalid || !this.isConfigured) return;
        this.errorMessage.set(null);
        this.status.set('sending');

        const payload = {
            name: this.form.controls.name.value,
            email: this.form.controls.email.value,
            subject: this.form.controls.subject.value,
            message: this.form.controls.message.value
        };

        this.http
            .post(`https://formspree.io/f/${environment.formspreeFormId}`, payload, {
                responseType: 'json',
                headers: { 'Content-Type': 'application/json' }
            })
            .subscribe({
                next: () => {
                    this.status.set('success');
                    this.form.reset({
                        name: '',
                        email: '',
                        subject: 'Ascend app – feedback or question',
                        message: ''
                    });
                },
                error: (err) => {
                    this.status.set('error');
                    this.errorMessage.set(
                        err?.error?.message || err?.message || 'Something went wrong. Please try again.'
                    );
                }
            });
    }
}
