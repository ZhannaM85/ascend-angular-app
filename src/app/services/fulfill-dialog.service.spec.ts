import { TestBed } from '@angular/core/testing';
import { FulfillDialogService } from './fulfill-dialog.service';

describe(FulfillDialogService.name, () => {
    let service: FulfillDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FulfillDialogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open and close', () => {
        const wish = { id: 'w1', title: 't', createdAt: 1 } as any;

        service.open(wish);
        expect(service.wishToFulfill()).toBe(wish);

        service.close();
        expect(service.wishToFulfill()).toBeNull();
    });
});

