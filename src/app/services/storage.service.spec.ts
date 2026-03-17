import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe(StorageService.name, () => {
    let service: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StorageService);
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return empty arrays when storage is empty', () => {
        expect(service.loadWishes()).toEqual([]);
        expect(service.loadCommitments()).toEqual([]);
        expect(service.loadReflections()).toEqual([]);
    });

    it('should return empty arrays when JSON is invalid', () => {
        localStorage.setItem('wishes', '{not-json');
        localStorage.setItem('commitments', '{not-json');
        localStorage.setItem('reflections', '{not-json');

        expect(service.loadWishes()).toEqual([]);
        expect(service.loadCommitments()).toEqual([]);
        expect(service.loadReflections()).toEqual([]);
    });
});

