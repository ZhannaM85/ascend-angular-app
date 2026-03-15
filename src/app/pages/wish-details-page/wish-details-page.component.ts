import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal
} from '@angular/core';
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

    readonly missedDayMessage = signal<string | null>(null);
    readonly justCompleted = signal(false);

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
}
