import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LOCALE_STORAGE_KEY = 'ascend-locale';
const SUPPORTED = ['en', 'ru'] as const;
export type LocaleId = (typeof SUPPORTED)[number];

/**
 * Type guard: returns true if value is a supported locale ID.
 *
 * @param value - String to check.
 * @returns True if value is a valid LocaleId.
 */
function isLocaleId(value: string): value is LocaleId {
    return SUPPORTED.includes(value as LocaleId);
}

/** Returns the initial locale from localStorage or default 'en'. */
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

    /**
     * Sets the active locale and persists to localStorage.
     *
     * @param locale - The locale to set.
     */
    setLocale(locale: LocaleId): void {
        this.translate.use(locale);
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        this.currentLocale.set(locale);
    }

    /**
     * Returns the list of supported locales with display labels.
     *
     * @returns Array of locale objects with id and label.
     */
    getSupportedLocales(): { id: LocaleId; label: string }[] {
        return [
            { id: 'en', label: 'English' },
            { id: 'ru', label: 'Русский' }
        ];
    }
}
