import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CompletionBannerComponent } from './completion-banner.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(CompletionBannerComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CompletionBannerComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(CompletionBannerComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(CompletionBannerComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

