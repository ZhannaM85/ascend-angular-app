import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ShareModalComponent } from './share-modal.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(ShareModalComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ShareModalComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(ShareModalComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(ShareModalComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

