import { TestBed } from '@angular/core/testing';
import { ShareService } from './share.service';

describe(ShareService.name, () => {
    let service: ShareService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShareService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open and close share state', () => {
        const wish = { id: 'w1', title: 't', createdAt: 1 } as any;
        const commitment = { id: 'c1', wishId: 'w1', title: 'c', duration: 1, startDate: 1, streak: 0, completed: false } as any;

        service.open(wish, commitment);
        expect(service.shareState()).toEqual({ wish, commitment });

        service.close();
        expect(service.shareState()).toBeNull();
    });
});

