import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { FulfilledWishesPageComponent } from './fulfilled-wishes-page.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(FulfilledWishesPageComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [FulfilledWishesPageComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(FulfilledWishesPageComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(FulfilledWishesPageComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

