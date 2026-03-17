import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { StreakCalendarComponent } from './streak-calendar.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(StreakCalendarComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [StreakCalendarComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(StreakCalendarComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(StreakCalendarComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

