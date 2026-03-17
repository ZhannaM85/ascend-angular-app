import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CreateWishPageComponent } from './create-wish-page.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(CreateWishPageComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CreateWishPageComponent],
            providers: [
                { provide: Router, useValue: { navigate: jest.fn() } },
                { provide: TranslateService, useValue: createMockTranslateService() }
            ]
        })
            .overrideComponent(CreateWishPageComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(CreateWishPageComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

