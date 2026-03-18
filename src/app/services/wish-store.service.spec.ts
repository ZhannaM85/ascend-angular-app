import { TestBed } from '@angular/core/testing';
import { WishStoreService } from './wish-store.service';
import { StorageService } from './storage.service';

class InMemoryStorageService {
    private wishes: any[] = [];

    private commitments: any[] = [];

    private reflections: any[] = [];

    public saveWishes(wishes: any[]): void {
        this.wishes = wishes;
    }

    public loadWishes(): any[] {
        return this.wishes;
    }

    public saveCommitments(commitments: any[]): void {
        this.commitments = commitments;
    }

    public loadCommitments(): any[] {
        return this.commitments;
    }

    public saveReflections(reflections: any[]): void {
        this.reflections = reflections;
    }

    public loadReflections(): any[] {
        return this.reflections;
    }
}

describe(WishStoreService.name, () => {
    let service: WishStoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: StorageService, useClass: InMemoryStorageService }]
        });
        service = TestBed.inject(WishStoreService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add a wish', () => {
        const wish = service.addWish('Wish', 'Commit', 5, 'Desc');
        expect(wish.id).toBeTruthy();
        expect(service.getWish(wish.id)?.title).toBe('Wish');
        expect(service.getCommitmentForWish(wish.id)?.duration).toBe(5);
    });
});

