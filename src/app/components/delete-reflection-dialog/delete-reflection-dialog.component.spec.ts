import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DeleteReflectionDialogComponent } from './delete-reflection-dialog.component';
import { createMockTranslateService } from '../../testing/mock-translate.service';

describe(DeleteReflectionDialogComponent.name, () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [DeleteReflectionDialogComponent],
            providers: [{ provide: TranslateService, useValue: createMockTranslateService() }]
        })
            .overrideComponent(DeleteReflectionDialogComponent, { set: { template: '' } });

        await TestBed.compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(DeleteReflectionDialogComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});

