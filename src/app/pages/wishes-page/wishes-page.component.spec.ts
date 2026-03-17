import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { WishesPageComponent } from './wishes-page.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(WishesPageComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [WishesPageComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(WishesPageComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(WishesPageComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

