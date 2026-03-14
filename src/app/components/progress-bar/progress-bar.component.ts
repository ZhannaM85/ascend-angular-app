import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
    readonly current = input.required<number>();
    readonly total = input.required<number>();
    readonly showLabel = input<boolean>(true);

    readonly percent = computed(() => {
        const t = this.total();
        const c = this.current();
        return t > 0 ? Math.min(100, (c / t) * 100) : 0;
    });
}
