import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { WishCardComponent } from './wish-card.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(WishCardComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [WishCardComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(WishCardComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(WishCardComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

