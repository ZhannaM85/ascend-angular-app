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
import { TranslatePipe } from '@ngx-translate/core';
import { DeleteReflectionDialogService } from '../../services/delete-reflection-dialog.service';
import type { Reflection } from '../../models/reflection.model';

/**
 * Returns the timestamp for midnight (00:00:00) of the given date in local timezone.
 *
 * @param ts - Timestamp in milliseconds.
 * @returns Timestamp for midnight of that day in local timezone.
 */
function getStartOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

/**
 * Returns true if both timestamps fall on the same calendar day in local timezone.
 *
 * @param a - First timestamp in milliseconds.
 * @param b - Second timestamp in milliseconds.
 * @returns True if same calendar day.
 */
function isSameCalendarDay(a: number, b: number): boolean {
    return getStartOfDay(a) === getStartOfDay(b);
}

@Component({
    selector: 'app-wish-details-page',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        TranslatePipe,
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

    /**
     * Records a check-in for today.
     */
    onCheckIn(): void {
        const c = this.commitment();
        if (!c) return;
        this.missedDayMessage.set(null);
        const result = this.store.checkIn(c.id);
        if (result.completed) {
            this.justCompleted.set(true);
        }
    }

    /**
     * Toggles a day's check-in status in the calendar.
     *
     * @param dayStart - Timestamp for the day.
     * @param checked - Whether the day should be checked.
     */
    onToggleDay(dayStart: number, checked: boolean): void {
        const c = this.commitment();
        if (!c) return;
        this.store.toggleCheckIn(c.id, dayStart, checked);
    }

    /**
     * Opens the share modal.
     */
    onShare(): void {
        const c = this.commitment();
        if (c && this.wish()) {
            this.shareService.open(this.wish()!, c);
        }
    }

    /**
     * Opens the fulfill wish dialog.
     */
    onMarkFulfilled(): void {
        const w = this.wish();
        if (w) this.fulfillDialog.open(w);
    }

    /**
     * Opens the delete wish dialog.
     */
    onDeleteWish(): void {
        const w = this.wish();
        if (w) this.deleteWishDialog.open(w);
    }

    /**
     * Formats a timestamp for display in the reflection list.
     *
     * @param ts - Timestamp in milliseconds.
     * @returns Formatted date string.
     */
    formatReflectionDate(ts: number): string {
        return new Date(ts).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Submits a new reflection.
     */
    onSubmitReflection(): void {
        const w = this.wish();
        if (!w || this.reflectionForm.invalid) return;
        const v = this.reflectionForm.getRawValue();
        this.store.addReflection(w.id, v.text);
        this.reflectionForm.reset({ text: '' });
    }

    /**
     * Opens the delete reflection dialog.
     *
     * @param reflection - The reflection to delete.
     */
    onDeleteReflection(reflection: Reflection): void {
        this.deleteReflectionDialog.open(reflection);
    }

    /**
     * Enters edit mode for a reflection.
     *
     * @param r - The reflection to edit.
     */
    startEditReflection(r: Reflection): void {
        this.editingReflectionId.set(r.id);
        this.editingReflectionText.set(r.text);
    }

    /**
     * Cancels reflection edit mode.
     */
    cancelEditReflection(): void {
        this.editingReflectionId.set(null);
        this.editingReflectionText.set('');
    }

    /**
     * Saves the edited reflection and exits edit mode.
     *
     * @param reflectionId - The reflection ID.
     */
    saveReflection(reflectionId: string): void {
        const text = this.editingReflectionText().trim();
        if (text) {
            this.store.updateReflection(reflectionId, text);
        }
        this.cancelEditReflection();
    }
}
