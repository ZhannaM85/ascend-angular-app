import { Injectable, signal } from '@angular/core';
import type { Reflection } from '../models/reflection.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteReflectionDialogService {
    readonly reflectionToDelete = signal<Reflection | null>(null);

    /**
     * Opens the delete reflection dialog for the given reflection.
     *
     * @param reflection - The reflection to delete.
     */
    open(reflection: Reflection): void {
        this.reflectionToDelete.set(reflection);
    }

    /**
     * Closes the delete reflection dialog.
     */
    close(): void {
        this.reflectionToDelete.set(null);
    }
}
