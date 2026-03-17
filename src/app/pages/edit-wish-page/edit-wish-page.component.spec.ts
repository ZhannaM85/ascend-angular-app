import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { EditWishPageComponent } from './edit-wish-page.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(EditWishPageComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [EditWishPageComponent],
            providers: [
                { provide: Router, useValue: { navigate: jest.fn() } },
                {
                    provide: ActivatedRoute,
                    useValue: { paramMap: of(convertToParamMap({ id: 'w1' })) }
                },
                { provide: TranslateService, useValue: createMockTranslateService() }
            ]
        })
            .overrideComponent(EditWishPageComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(EditWishPageComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

