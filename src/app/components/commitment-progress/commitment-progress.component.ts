import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { Commitment } from '../../models/commitment.model';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { StreakBadgeComponent } from '../streak-badge/streak-badge.component';

@Component({
    selector: 'app-commitment-progress',
    imports: [TranslatePipe, ProgressBarComponent, StreakBadgeComponent],
    templateUrl: './commitment-progress.component.html',
    styleUrl: './commitment-progress.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitmentProgressComponent {
    readonly commitment = input.required<Commitment>();

    readonly showKeepGoing = input<boolean>(true);
}
