import { Injectable, signal } from '@angular/core';
import type { Reflection } from '../models/reflection.model';

@Injectable({
    providedIn: 'root'
})
export class DeleteReflectionDialogService {
    public readonly reflectionToDelete = signal<Reflection | null>(null);

    /**
     * Opens the delete reflection dialog for the given reflection.
     *
     * @param reflection - The reflection to delete.
     */
    public open(reflection: Reflection): void {
        this.reflectionToDelete.set(reflection);
    }

    /**
     * Closes the delete reflection dialog.
     */
    public close(): void {
        this.reflectionToDelete.set(null);
    }
}
