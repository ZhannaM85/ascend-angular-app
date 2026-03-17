import { TestBed } from '@angular/core/testing';
import { DeleteReflectionDialogService } from './delete-reflection-dialog.service';

describe(DeleteReflectionDialogService.name, () => {
    let service: DeleteReflectionDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DeleteReflectionDialogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open and close', () => {
        const reflection = { id: 'r1', wishId: 'w1', text: 'hello', date: 1 } as any;

        service.open(reflection);
        expect(service.reflectionToDelete()).toBe(reflection);

        service.close();
        expect(service.reflectionToDelete()).toBeNull();
    });
});

