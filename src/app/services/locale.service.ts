import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LOCALE_STORAGE_KEY = 'ascend-locale';
const SUPPORTED = ['en', 'ru'] as const;
export type LocaleId = (typeof SUPPORTED)[number];

function isLocaleId(value: string): value is LocaleId {
    return SUPPORTED.includes(value as LocaleId);
}

@Injectable({
    providedIn: 'root'
})
export class LocaleService {
    private readonly translate = inject(TranslateService);

    readonly currentLocale = signal<LocaleId>('en');

    readonly localeLabel = computed(() => {
        const id = this.currentLocale();
        return id === 'ru' ? 'Русский' : 'English';
    });

    constructor() {
        this.translate.addLangs([...SUPPORTED]);
        const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
        const lang: LocaleId = saved && isLocaleId(saved) ? saved : 'en';
        this.translate.use(lang);
        this.currentLocale.set(lang);
        this.translate.onLangChange.subscribe((e) => {
            if (isLocaleId(e.lang)) this.currentLocale.set(e.lang);
        });
    }

    setLocale(locale: LocaleId): void {
        this.translate.use(locale);
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        this.currentLocale.set(locale);
    }

    getSupportedLocales(): { id: LocaleId; label: string }[] {
        return [
            { id: 'en', label: 'English' },
            { id: 'ru', label: 'Русский' }
        ];
    }
}
