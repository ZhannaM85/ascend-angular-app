import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-daily-checkin',
    imports: [TranslatePipe],
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
