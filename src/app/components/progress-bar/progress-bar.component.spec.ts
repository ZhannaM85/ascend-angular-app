import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ProgressBarComponent } from './progress-bar.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(ProgressBarComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ProgressBarComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(ProgressBarComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(ProgressBarComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

