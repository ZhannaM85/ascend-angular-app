import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from './locale.service';
import { createMockTranslateService } from '../testing/mock-translate.service';

describe(LocaleService.name, () => {
    let service: LocaleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslateService, useValue: createMockTranslateService() }
            ]
        });
        service = TestBed.inject(LocaleService);
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should expose supported locales', () => {
        expect(service.getSupportedLocales()).toEqual([
            { id: 'en', label: 'English' },
            { id: 'ru', label: 'Русский' }
        ]);
    });
});

