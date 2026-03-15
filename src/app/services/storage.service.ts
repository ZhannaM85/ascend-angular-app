import { Injectable } from '@angular/core';
import type { Wish } from '../models/wish.model';
import type { Commitment } from '../models/commitment.model';
import type { Reflection } from '../models/reflection.model';

const WISHES_KEY = 'wishes';
const COMMITMENTS_KEY = 'commitments';
const REFLECTIONS_KEY = 'reflections';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    saveWishes(wishes: Wish[]): void {
        localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
    }

    loadWishes(): Wish[] {
        const raw = localStorage.getItem(WISHES_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as Wish[];
        } catch {
            return [];
        }
    }

    saveCommitments(commitments: Commitment[]): void {
        localStorage.setItem(COMMITMENTS_KEY, JSON.stringify(commitments));
    }

    loadCommitments(): Commitment[] {
        const raw = localStorage.getItem(COMMITMENTS_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as Commitment[];
        } catch {
            return [];
        }
    }

    saveReflections(reflections: Reflection[]): void {
        localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
    }

    loadReflections(): Reflection[] {
        const raw = localStorage.getItem(REFLECTIONS_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as Reflection[];
        } catch {
            return [];
        }
    }
}
