import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MainLayoutComponent } from './main-layout.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(MainLayoutComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [MainLayoutComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(MainLayoutComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(MainLayoutComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

