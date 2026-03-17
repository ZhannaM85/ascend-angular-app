import { TestBed } from '@angular/core/testing';
import { DeleteWishDialogService } from './delete-wish-dialog.service';

describe(DeleteWishDialogService.name, () => {
    let service: DeleteWishDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DeleteWishDialogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open and close', () => {
        const wish = { id: 'w1', title: 't', createdAt: 1 } as any;

        service.open(wish);
        expect(service.wishToDelete()).toBe(wish);

        service.close();
        expect(service.wishToDelete()).toBeNull();
    });
});

