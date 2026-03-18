import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Commitment } from '../../models/commitment.model';
import type { Wish } from '../../models/wish.model';
import { TranslatePipe } from '@ngx-translate/core';
import { TruncateTooltipDirective } from '../../directives/truncate-tooltip.directive';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { StreakBadgeComponent } from '../streak-badge/streak-badge.component';

@Component({
    selector: 'app-wish-card',
    imports: [RouterLink, TranslatePipe, TruncateTooltipDirective, ProgressBarComponent, StreakBadgeComponent],
    templateUrl: './wish-card.component.html',
    styleUrl: './wish-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishCardComponent {
    readonly wish = input.required<Wish>();

    readonly commitment = input.required<Commitment | undefined>();

    readonly shareClick = output<void>();

    readonly deleteClick = output<void>();
}
