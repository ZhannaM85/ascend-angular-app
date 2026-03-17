import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { StreakBadgeComponent } from './streak-badge.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(StreakBadgeComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [StreakBadgeComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(StreakBadgeComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(StreakBadgeComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

