import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FulfillWishDialogComponent } from './fulfill-wish-dialog.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(FulfillWishDialogComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [FulfillWishDialogComponent],
            providers: [
                { provide: Router, useValue: { navigate: jest.fn() } },
                { provide: TranslateService, useValue: createMockTranslateService() }
            ]
        })
            .overrideComponent(FulfillWishDialogComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(FulfillWishDialogComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

