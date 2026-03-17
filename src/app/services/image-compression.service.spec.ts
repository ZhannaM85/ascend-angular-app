import { TestBed } from '@angular/core/testing';
import { ImageCompressionService } from './image-compression.service';

describe(ImageCompressionService.name, () => {
    let service: ImageCompressionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ImageCompressionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should reject non-image files', async () => {
        const file = new File(['hello'], 'note.txt', { type: 'text/plain' });
        await expect(service.compress(file)).rejects.toThrow('File is not an image');
    });
});

