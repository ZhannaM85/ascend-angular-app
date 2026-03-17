import { TestBed } from '@angular/core/testing';
import { LeaveConfirmDialogService } from './leave-confirm-dialog.service';

describe(LeaveConfirmDialogService.name, () => {
    let service: LeaveConfirmDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LeaveConfirmDialogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should resolve confirmation on confirmLeave', async () => {
        const promise = service.showConfirm('Are you sure?');
        expect(service.visible()).toBe(true);

        service.confirmLeave();
        await expect(promise).resolves.toBe(true);
        expect(service.visible()).toBe(false);
    });

    it('should resolve confirmation on cancel', async () => {
        const promise = service.showConfirm('Are you sure?');
        expect(service.visible()).toBe(true);

        service.cancel();
        await expect(promise).resolves.toBe(false);
        expect(service.visible()).toBe(false);
    });
});

