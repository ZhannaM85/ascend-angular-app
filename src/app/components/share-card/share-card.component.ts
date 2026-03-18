import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { Commitment } from '../../models/commitment.model';
import type { Wish } from '../../models/wish.model';

@Component({
    selector: 'app-share-card',
    imports: [TranslatePipe],
    templateUrl: './share-card.component.html',
    styleUrl: './share-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareCardComponent {
    private readonly elementRef = inject(ElementRef);

    readonly wish = input.required<Wish>();

    readonly commitment = input.required<Commitment>();

    /**
     * Root DOM element used for image capture (share/download).
     *
     * @returns The first child element of the host.
     */
    get rootElement(): HTMLElement {
        return this.elementRef.nativeElement.firstElementChild as HTMLElement;
    }
}
