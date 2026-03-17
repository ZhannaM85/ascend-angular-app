import { Subject } from 'rxjs';
import type { LangChangeEvent, TranslateService } from '@ngx-translate/core';

export function createMockTranslateService(
    overrides?: Partial<TranslateService>
): Partial<TranslateService> {
    const onLangChange = new Subject<LangChangeEvent>();

    return {
        addLangs: () => undefined,
        setDefaultLang: () => undefined,
        use: () => undefined,
        instant: (key: string) => key,
        onLangChange: onLangChange.asObservable(),
        ...overrides
    };
}

