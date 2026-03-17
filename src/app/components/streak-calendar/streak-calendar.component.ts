import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import type { Commitment } from '../../models/commitment.model';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getStartOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

@Component({
    selector: 'app-streak-calendar',
    imports: [TranslatePipe],
    templateUrl: './streak-calendar.component.html',
    styleUrl: './streak-calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreakCalendarComponent {
    private readonly translate = inject(TranslateService);

    readonly commitment = input.required<Commitment>();
    readonly toggle = output<{ dayStart: number; checked: boolean }>();

    getStatusLabel(status: 'checked' | 'missed' | 'future'): string {
        if (status === 'checked') return this.translate.instant('streakCalendar.done');
        if (status === 'missed') return this.translate.instant('streakCalendar.missed');
        return this.translate.instant('streakCalendar.upcoming');
    }

    readonly days = computed(() => {
        const c = this.commitment();
        const startDate = getStartOfDay(c.startDate);
        const todayStart = getStartOfDay(Date.now());
        const checked = new Set((c.checkIns ?? []).map(getStartOfDay));
        const result: { dayIndex: number; label: string; status: 'checked' | 'missed' | 'future' }[] = [];
        for (let i = 0; i < c.duration; i++) {
            const dayStart = startDate + i * MS_PER_DAY;
            const d = new Date(dayStart);
            const label = DAY_LABELS[d.getDay()];
            let status: 'checked' | 'missed' | 'future' = 'future';
            if (checked.has(dayStart)) status = 'checked';
            else if (dayStart < todayStart) status = 'missed';
            result.push({ dayIndex: i + 1, label, status });
        }
        return result;
    });

    onToggle(dayIndex: number): void {
        const c = this.commitment();
        const startDate = getStartOfDay(c.startDate);
        const dayStart = startDate + (dayIndex - 1) * MS_PER_DAY;
        const todayStart = getStartOfDay(Date.now());
        if (dayStart > todayStart) return;
        const checked = new Set((c.checkIns ?? []).map(getStartOfDay));
        const nextChecked = !checked.has(dayStart);
        this.toggle.emit({ dayStart, checked: nextChecked });
    }
}
