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
    public readonly alreadyCheckedToday = input.required<boolean>();

    public readonly disabled = input<boolean>(false);

    public readonly completed = input<boolean>(false);

    public readonly checkIn = output<void>();
}
