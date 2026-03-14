import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { toPng } from 'html-to-image';
import { ShareService } from '../../services/share.service';
import { ShareCardComponent } from '../share-card/share-card.component';

@Component({
    selector: 'app-share-modal',
    imports: [ShareCardComponent],
    templateUrl: './share-modal.component.html',
    styleUrl: './share-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareModalComponent {
    private readonly shareService = inject(ShareService);

    readonly shareCardRef = viewChild(ShareCardComponent);
    readonly shareState = this.shareService.shareState;

    close(): void {
        this.shareService.close();
    }

    private getCardElement(): HTMLElement | null {
        const comp = this.shareCardRef();
        return comp?.rootElement ?? null;
    }

    async download(): Promise<void> {
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

    async share(): Promise<void> {
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
