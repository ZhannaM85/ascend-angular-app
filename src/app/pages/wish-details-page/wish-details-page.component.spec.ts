import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { WishDetailsPageComponent } from './wish-details-page.component';

describe(WishDetailsPageComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [WishDetailsPageComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { paramMap: of(convertToParamMap({ id: 'w1' })) }
                }
            ]
        })
            .overrideComponent(WishDetailsPageComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(WishDetailsPageComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

