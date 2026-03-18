import { ChangeDetectionStrategy, Component, effect, inject, Injector, viewChild } from '@angular/core';
import { toPng } from 'html-to-image';
import { TranslatePipe } from '@ngx-translate/core';
import { ShareService } from '../../services/share.service';
import { ShareCardComponent } from '../share-card/share-card.component';

@Component({
    selector: 'app-share-modal',
    imports: [TranslatePipe, ShareCardComponent],
    templateUrl: './share-modal.component.html',
    styleUrl: './share-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareModalComponent {
    private readonly shareService = inject(ShareService);

    private readonly injector = inject(Injector);

    public readonly shareCardRef = viewChild(ShareCardComponent);

    public readonly shareState = this.shareService.shareState;

    constructor() {
        effect((onCleanup) => {
            if (typeof document === 'undefined') return;

            const isOpen = Boolean(this.shareState());
            if (!isOpen) return;

            const body = document.body;
            const prevOverflow = body.style.overflow;
            const prevOverscroll = body.style.overscrollBehavior;

            body.style.overflow = 'hidden';
            body.style.overscrollBehavior = 'none';

            onCleanup(() => {
                body.style.overflow = prevOverflow;
                body.style.overscrollBehavior = prevOverscroll;
            });
        }, { injector: this.injector });
    }

    /**
     * Closes the share modal.
     */
    public close(): void {
        this.shareService.close();
    }

    /**
     * Returns the share card element for image capture.
     *
     * @returns The share card root element or null.
     */
    private getCardElement(): HTMLElement | null {
        const comp = this.shareCardRef();
        return comp?.rootElement ?? null;
    }

    /**
     * Downloads the share card as a PNG image.
     */
    public async download(): Promise<void> {
        const el = this.getCardElement();
        if (!el) return;
        try {
            const dataUrl = await toPng(el, { pixelRatio: 1 });
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'ascend-progress.png';
            a.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        }
    }

    /**
     * Shares via Web Share API if available; otherwise triggers download.
     */
    public async share(): Promise<void> {
        const el = this.getCardElement();
        if (!el) return;
        try {
            const blob = await toPng(el, { pixelRatio: 1 }).then((dataUrl) => {
                const res = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
                if (!res) throw new Error('Invalid data URL');
                const binary = atob(res[2]);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                return new Blob([bytes], { type: 'image/png' });
            });
            const file = new File([blob], 'ascend-progress.png', { type: 'image/png' });
            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'My Ascend progress'
                });
            } else {
                this.download();
            }
        } catch (err) {
            console.error('Share failed', err);
            this.download();
        }
    }
}
