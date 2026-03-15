import { Injectable, signal } from '@angular/core';
import type { Reflection } from '../models/reflection.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteReflectionDialogService {
    readonly reflectionToDelete = signal<Reflection | null>(null);

    open(reflection: Reflection): void {
        this.reflectionToDelete.set(reflection);
    }

    close(): void {
        this.reflectionToDelete.set(null);
    }
}
