import { Injectable } from '@angular/core';

const DEFAULT_MAX_WIDTH = 800;
const DEFAULT_QUALITY = 0.75;

/**
 * Compresses an image file for storage (e.g. in LocalStorage).
 * Resizes to max width and encodes as JPEG to keep size small.
 */
@Injectable({
    providedIn: 'root'
})
export class ImageCompressionService {
    /**
     * Compresses a file and returns a data URL (e.g. data:image/jpeg;base64,...).
     * Rejects if the file is not an image or compression fails.
     *
     * @param file - The image file to compress.
     * @param options - Optional maxWidth and quality overrides.
     * @returns Promise resolving to base64 data URL.
     * @throws Error if file is not an image or compression fails.
     */
    public async compress(
        file: File,
        options?: { maxWidth?: number; quality?: number }
    ): Promise<string> {
        const maxWidth = options?.maxWidth ?? DEFAULT_MAX_WIDTH;
        const quality = options?.quality ?? DEFAULT_QUALITY;

        if (!file.type.startsWith('image/')) {
            throw new Error('File is not an image');
        }

        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                try {
                    const dataUrl = this.drawAndCompress(img, maxWidth, quality);
                    URL.revokeObjectURL(url);
                    resolve(dataUrl);
                } catch (err) {
                    URL.revokeObjectURL(url);
                    reject(err);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };
            img.src = url;
        });
    }

    /**
     * Draws the image to a canvas, resizes, and returns a JPEG data URL.
     *
     * @param img - The loaded image element.
     * @param maxWidth - Maximum width in pixels.
     * @param quality - JPEG quality 0-1.
     * @returns Base64 data URL.
     */
    private drawAndCompress(
        img: HTMLImageElement,
        maxWidth: number,
        quality: number
    ): string {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const scale = w > maxWidth ? maxWidth / w : 1;
        const cw = Math.round(w * scale);
        const ch = Math.round(h * scale);

        const canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, 0, 0, cw, ch);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        return dataUrl;
    }
}
