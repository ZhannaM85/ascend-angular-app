import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LOCALE_STORAGE_KEY = 'ascend-locale';
const SUPPORTED = ['en', 'ru'] as const;
export type LocaleId = (typeof SUPPORTED)[number];

function isLocaleId(value: string): value is LocaleId {
    return SUPPORTED.includes(value as LocaleId);
}

function getInitialLocale(): LocaleId {
    if (typeof window === 'undefined') {
        return 'en';
    }
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return saved && isLocaleId(saved) ? saved : 'en';
}

@Injectable({
    providedIn: 'root'
})
export class LocaleService {
    private readonly translate = inject(TranslateService);

    private readonly initialLocale: LocaleId = getInitialLocale();

    readonly currentLocale = signal<LocaleId>(this.initialLocale);

    readonly localeLabel = computed(() => {
        const id = this.currentLocale();
        return id === 'ru' ? 'Русский' : 'English';
    });

    constructor() {
        this.translate.addLangs([...SUPPORTED]);
        this.translate.setDefaultLang('en');
        this.translate.use(this.initialLocale);
        this.translate.onLangChange.subscribe((e) => {
            if (isLocaleId(e.lang)) this.currentLocale.set(e.lang);
        });
    }

    setLocale(locale: LocaleId): void {
        this.translate.use(locale);
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        this.currentLocale.set(locale);
    }

    getSupportedLocales(): { id: LocaleId; label: string }[] {
        return [
            { id: 'en', label: 'English' },
            { id: 'ru', label: 'Русский' }
        ];
    }
}
