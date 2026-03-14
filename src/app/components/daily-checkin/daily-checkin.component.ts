import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    selector: 'app-daily-checkin',
    templateUrl: './daily-checkin.component.html',
    styleUrl: './daily-checkin.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyCheckinComponent {
    readonly alreadyCheckedToday = input.required<boolean>();
    readonly disabled = input<boolean>(false);
    readonly completed = input<boolean>(false);

    readonly checkIn = output<void>();
}
