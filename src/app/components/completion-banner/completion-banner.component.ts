import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-completion-banner',
    templateUrl: './completion-banner.component.html',
    styleUrl: './completion-banner.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletionBannerComponent {
    readonly duration = input.required<number>();
}
