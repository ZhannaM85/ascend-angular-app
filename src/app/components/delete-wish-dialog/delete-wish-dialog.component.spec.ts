import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DeleteWishDialogComponent } from './delete-wish-dialog.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(DeleteWishDialogComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [DeleteWishDialogComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(DeleteWishDialogComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(DeleteWishDialogComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

