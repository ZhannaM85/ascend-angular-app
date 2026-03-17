import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LeaveConfirmDialogComponent } from './leave-confirm-dialog.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(LeaveConfirmDialogComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [LeaveConfirmDialogComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(LeaveConfirmDialogComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(LeaveConfirmDialogComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

