import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { AboutPageComponent } from './about-page.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(AboutPageComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AboutPageComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(AboutPageComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(AboutPageComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

