import { Subject } from 'rxjs';
import type { TranslateService } from '@ngx-translate/core';

export function createMockTranslateService(
    overrides?: Partial<TranslateService>
): Partial<TranslateService> {
    const onLangChange = new Subject<{ lang: string }>();

    return {
        addLangs: jest.fn(),
        setDefaultLang: jest.fn(),
        use: jest.fn(),
        instant: jest.fn((key: string) => key),
        onLangChange,
        ...overrides
    };
}

