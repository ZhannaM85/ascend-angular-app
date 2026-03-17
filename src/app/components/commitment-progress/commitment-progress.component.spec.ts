import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CommitmentProgressComponent } from './commitment-progress.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(CommitmentProgressComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommitmentProgressComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(CommitmentProgressComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(CommitmentProgressComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

