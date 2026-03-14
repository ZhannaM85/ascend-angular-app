import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
    templateUrl: './streak-calendar.component.html',
    styleUrl: './streak-calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreakCalendarComponent {
    readonly commitment = input.required<Commitment>();

    readonly days = computed(() => {
        const c = this.commitment();
        const startDate = getStartOfDay(c.startDate);
        const todayStart = getStartOfDay(Date.now());
        const result: { dayIndex: number; label: string; status: 'checked' | 'missed' | 'future' }[] = [];
        for (let i = 0; i < c.duration; i++) {
            const dayStart = startDate + i * MS_PER_DAY;
            const d = new Date(dayStart);
            const label = DAY_LABELS[d.getDay()];
            let status: 'checked' | 'missed' | 'future' = 'future';
            if (i < c.streak) status = 'checked';
            else if (dayStart < todayStart) status = 'missed';
            result.push({ dayIndex: i + 1, label, status });
        }
        return result;
    });
}
