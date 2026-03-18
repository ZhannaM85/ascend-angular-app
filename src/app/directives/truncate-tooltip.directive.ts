import {
    AfterViewInit,
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy
} from '@angular/core';

/**
 * Sets the element's title (native tooltip) only when the content is truncated.
 * Use on elements with truncate or line-clamp so the tooltip appears only when needed.
 */
@Directive({
    selector: '[appTruncateTooltip]',
    standalone: true
})
export class TruncateTooltipDirective implements AfterViewInit, OnDestroy {
    private readonly el = inject(ElementRef<HTMLElement>);

    private resizeObserver: ResizeObserver | null = null;

    /** Full text to show in tooltip when content is truncated. */
    readonly appTruncateTooltip = input.required<string>();

    constructor() {
        effect(() => {
            this.appTruncateTooltip();
            queueMicrotask(() => this.updateTitle());
        });
    }

    ngAfterViewInit(): void {
        this.updateTitle();
        this.resizeObserver = new ResizeObserver(() => this.updateTitle());
        this.resizeObserver.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    /**
     * Updates the title attribute when content is truncated.
     */
    private updateTitle(): void {
        const text = this.appTruncateTooltip();
        const host = this.el.nativeElement;
        if (!text) {
            host.removeAttribute('title');
            return;
        }
        const truncated =
            host.scrollWidth > host.clientWidth || host.scrollHeight > host.clientHeight;
        if (truncated) {
            host.setAttribute('title', text);
        } else {
            host.removeAttribute('title');
        }
    }
}
