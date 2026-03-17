import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DailyCheckinComponent } from './daily-checkin.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(DailyCheckinComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [DailyCheckinComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(DailyCheckinComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(DailyCheckinComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

