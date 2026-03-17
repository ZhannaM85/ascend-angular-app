import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { createMockTranslateService } from './testing/mock-translate.service';

describe(AppComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(AppComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

