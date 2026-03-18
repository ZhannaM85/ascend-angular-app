import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-progress-bar',
    imports: [TranslatePipe],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
    public readonly current = input.required<number>();

    public readonly total = input.required<number>();

    public readonly showLabel = input<boolean>(true);

    public readonly percent = computed(() => {
        const t = this.total();
        const c = this.current();
        return t > 0 ? Math.min(100, (c / t) * 100) : 0;
    });
}
