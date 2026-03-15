import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-completion-banner',
    imports: [TranslatePipe],
    templateUrl: './completion-banner.component.html',
    styleUrl: './completion-banner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletionBannerComponent {
    readonly duration = input.required<number>();
}
