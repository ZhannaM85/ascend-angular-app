import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WishStoreService } from '../../services/wish-store.service';
import { CommitmentProgressComponent } from '../../components/commitment-progress/commitment-progress.component';
import { CompletionBannerComponent } from '../../components/completion-banner/completion-banner.component';
import { DailyCheckinComponent } from '../../components/daily-checkin/daily-checkin.component';
import { StreakCalendarComponent } from '../../components/streak-calendar/streak-calendar.component';
import { ShareService } from '../../services/share.service';
import { FulfillDialogService } from '../../services/fulfill-dialog.service';
import { DeleteWishDialogService } from '../../services/delete-wish-dialog.service';
import { DeleteReflectionDialogService } from '../../services/delete-reflection-dialog.service';
import type { Reflection } from '../../models/reflection.model';

function getStartOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function isSameCalendarDay(a: number, b: number): boolean {
    return getStartOfDay(a) === getStartOfDay(b);
}

@Component({
    selector: 'app-wish-details-page',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        CommitmentProgressComponent,
        CompletionBannerComponent,
        DailyCheckinComponent,
        StreakCalendarComponent
    ],
    templateUrl: './wish-details-page.component.html',
    styleUrl: './wish-details-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishDetailsPageComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject(WishStoreService);
    private readonly shareService = inject(ShareService);
    private readonly fulfillDialog = inject(FulfillDialogService);
    private readonly deleteWishDialog = inject(DeleteWishDialogService);
    private readonly deleteReflectionDialog = inject(DeleteReflectionDialogService);
    private readonly fb = inject(FormBuilder);

    private readonly idParam = toSignal(
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

    readonly alreadyCheckedToday = computed(() => {
        const c = this.commitment();
        if (!c?.lastCheckIn) return false;
        return isSameCalendarDay(c.lastCheckIn, Date.now());
    });

    readonly commitmentNotYetStarted = computed(() => {
        const c = this.commitment();
        if (!c) return false;
        const todayStart = getStartOfDay(Date.now());
        const commitmentStart = getStartOfDay(c.startDate);
        return todayStart < commitmentStart;
    });

    readonly commitmentStartDateFormatted = computed(() => {
        const c = this.commitment();
        if (!c) return '';
        return new Date(c.startDate).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });

    readonly reflections = computed(() => {
        const w = this.wish();
        return w ? this.store.getReflectionsForWish(w.id) : [];
    });

    readonly reflectionForm = this.fb.nonNullable.group({
        text: ['', [Validators.required, Validators.minLength(1)]]
    });

    readonly missedDayMessage = signal<string | null>(null);
    readonly justCompleted = signal(false);
    readonly editingReflectionId = signal<string | null>(null);
    readonly editingReflectionText = signal('');

    onCheckIn(): void {
        const c = this.commitment();
        if (!c) return;
        this.missedDayMessage.set(null);
        const result = this.store.checkIn(c.id);
        if (result.missedDayReset) {
            this.missedDayMessage.set('You missed a day. Progress lost. Start again today.');
        }
        if (result.completed) {
            this.justCompleted.set(true);
        }
    }

    onShare(): void {
        const c = this.commitment();
        if (c && this.wish()) {
            this.shareService.open(this.wish()!, c);
        }
    }

    onMarkFulfilled(): void {
        const w = this.wish();
        if (w) this.fulfillDialog.open(w);
    }

    onDeleteWish(): void {
        const w = this.wish();
        if (w) this.deleteWishDialog.open(w);
    }

    formatReflectionDate(ts: number): string {
        return new Date(ts).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    onSubmitReflection(): void {
        const w = this.wish();
        if (!w || this.reflectionForm.invalid) return;
        const v = this.reflectionForm.getRawValue();
        this.store.addReflection(w.id, v.text);
        this.reflectionForm.reset({ text: '' });
    }

    onDeleteReflection(reflection: Reflection): void {
        this.deleteReflectionDialog.open(reflection);
    }

    startEditReflection(r: Reflection): void {
        this.editingReflectionId.set(r.id);
        this.editingReflectionText.set(r.text);
    }

    cancelEditReflection(): void {
        this.editingReflectionId.set(null);
        this.editingReflectionText.set('');
    }

    saveReflection(reflectionId: string): void {
        const text = this.editingReflectionText().trim();
        if (text) {
            this.store.updateReflection(reflectionId, text);
        }
        this.cancelEditReflection();
    }
}
