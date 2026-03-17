import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ShareCardComponent } from './share-card.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(ShareCardComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ShareCardComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(ShareCardComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(ShareCardComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

