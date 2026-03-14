import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-streak-badge',
    templateUrl: './streak-badge.component.html',
    styleUrl: './streak-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreakBadgeComponent {
    readonly streak = input.required<number>();
}
