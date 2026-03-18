import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-streak-badge',
    imports: [TranslatePipe],
    templateUrl: './streak-badge.component.html',
    styleUrl: './streak-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreakBadgeComponent {
    public readonly streak = input.required<number>();
}
