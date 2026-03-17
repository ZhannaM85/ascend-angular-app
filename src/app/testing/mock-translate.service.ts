import { of, Subject } from 'rxjs';
import type {
    InterpolatableTranslationObject,
    LangChangeEvent,
    Language,
    TranslateService
} from '@ngx-translate/core';

export function createMockTranslateService(
    overrides?: Partial<TranslateService>
): Partial<TranslateService> {
    const onLangChange = new Subject<LangChangeEvent>();

    return {
        addLangs: (_languages: Language[]) => undefined,
        setDefaultLang: (_lang: Language) =>
            of({} as InterpolatableTranslationObject),
        use: (_lang: Language) => of({} as InterpolatableTranslationObject),
        instant: (key: string) => key,
        onLangChange: onLangChange.asObservable(),
        ...overrides
    };
}

