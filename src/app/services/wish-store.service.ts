import { computed, inject, Injectable, signal } from '@angular/core';
import type { Commitment } from '../models/commitment.model';
import type { Reflection } from '../models/reflection.model';
import type { Wish } from '../models/wish.model';
import { StorageService } from './storage.service';

function generateId(): string {
    return Math.random().toString(36).slice(2, 9);
}

function getStartOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function isSameCalendarDay(a: number, b: number): boolean {
    return getStartOfDay(a) === getStartOfDay(b);
}

function daysBetween(a: number, b: number): number {
    const start = getStartOfDay(a);
    const end = getStartOfDay(b);
    return Math.floor((end - start) / (24 * 60 * 60 * 1000));
}

function uniqSorted(nums: number[]): number[] {
    return [...new Set(nums)].sort((a, b) => a - b);
}

function computeProgress(c: Commitment): Pick<Commitment, 'streak' | 'completed' | 'lastCheckIn'> {
    const start = getStartOfDay(c.startDate);
    const duration = Math.max(0, c.duration);
    const endExclusive = start + duration * 24 * 60 * 60 * 1000;

    const all = uniqSorted((c.checkIns ?? []).map(getStartOfDay));
    const inWindow = all.filter((d) => d >= start && d < endExclusive);
    const lastCheckIn = all.length > 0 ? all[all.length - 1] : undefined;

    return {
        streak: inWindow.length,
        completed: duration > 0 && inWindow.length >= duration,
        lastCheckIn
    };
}

function migrateCommitment(raw: Commitment): Commitment {
    if (raw.checkIns && Array.isArray(raw.checkIns)) {
        const normalized: Commitment = { ...raw, checkIns: uniqSorted(raw.checkIns.map(getStartOfDay)) };
        return { ...normalized, ...computeProgress(normalized) };
    }

    // Legacy migration: old model assumed the first `streak` days were checked.
    const start = getStartOfDay(raw.startDate);
    const legacyCheckIns: number[] = [];
    for (let i = 0; i < Math.max(0, raw.streak); i++) {
        legacyCheckIns.push(start + i * 24 * 60 * 60 * 1000);
    }
    const migrated: Commitment = { ...raw, checkIns: uniqSorted(legacyCheckIns) };
    return { ...migrated, ...computeProgress(migrated) };
}

@Injectable({
    providedIn: 'root'
})
export class WishStoreService {
    private readonly storage = inject(StorageService);

    private readonly wishesSignal = signal<Wish[]>([]);
    private readonly commitmentsSignal = signal<Commitment[]>([]);
    private readonly reflectionsSignal = signal<Reflection[]>([]);

    readonly wishes = this.wishesSignal.asReadonly();
    readonly commitments = this.commitmentsSignal.asReadonly();
    readonly reflections = this.reflectionsSignal.asReadonly();

    readonly activeWishes = computed(() =>
        this.wishesSignal().filter((w) => !w.fulfilled)
    );
    readonly fulfilledWishes = computed(() =>
        this.wishesSignal().filter((w) => w.fulfilled)
    );

    constructor() {
        this.wishesSignal.set(this.storage.loadWishes());
        this.commitmentsSignal.set(this.storage.loadCommitments().map(migrateCommitment));
        this.reflectionsSignal.set(this.storage.loadReflections());
    }

    private persist(): void {
        this.storage.saveWishes(this.wishesSignal());
        this.storage.saveCommitments(this.commitmentsSignal());
        this.storage.saveReflections(this.reflectionsSignal());
    }

    getReflectionsForWish(wishId: string): Reflection[] {
        return this.reflectionsSignal()
            .filter((r) => r.wishId === wishId)
            .sort((a, b) => b.date - a.date);
    }

    addReflection(wishId: string, text: string, date?: number): Reflection {
        const dateTs = date != null ? getStartOfDay(date) : getStartOfDay(Date.now());
        const reflection: Reflection = {
            id: generateId(),
            wishId,
            text: text.trim(),
            date: dateTs
        };
        this.reflectionsSignal.update((list) => [...list, reflection]);
        this.persist();
        return reflection;
    }

    updateReflection(reflectionId: string, text: string): void {
        const trimmed = text.trim();
        this.reflectionsSignal.update((list) =>
            list.map((r) =>
                r.id === reflectionId ? { ...r, text: trimmed } : r
            )
        );
        this.persist();
    }

    deleteReflection(reflectionId: string): void {
        this.reflectionsSignal.update((list) =>
            list.filter((r) => r.id !== reflectionId)
        );
        this.persist();
    }

    addWish(
        title: string,
        commitmentTitle: string,
        duration: number,
        description?: string,
        commitmentStartDate?: number,
        imageDataUrl?: string
    ): Wish {
        const wish: Wish = {
            id: generateId(),
            title,
            description,
            ...(imageDataUrl && { imageDataUrl }),
            createdAt: Date.now()
        };
        const startDate = commitmentStartDate != null
            ? getStartOfDay(commitmentStartDate)
            : getStartOfDay(Date.now());
        const commitment: Commitment = {
            id: generateId(),
            wishId: wish.id,
            title: commitmentTitle,
            duration,
            startDate,
            checkIns: [],
            streak: 0,
            completed: false
        };
        this.wishesSignal.update((w) => [...w, wish]);
        this.commitmentsSignal.update((c) => [...c, commitment]);
        this.persist();
        return wish;
    }

    getCommitmentForWish(wishId: string): Commitment | undefined {
        return this.commitmentsSignal().find((c) => c.wishId === wishId);
    }

    getWish(id: string): Wish | undefined {
        return this.wishesSignal().find((w) => w.id === id);
    }

    updateWish(
        wishId: string,
        updates: {
            title?: string;
            description?: string;
            imageDataUrl?: string | null;
        }
    ): void {
        this.wishesSignal.update((list) =>
            list.map((w) => {
                if (w.id !== wishId) return w;
                const next = { ...w };
                if (updates.title !== undefined) next.title = updates.title;
                if (updates.description !== undefined)
                    next.description = updates.description;
                if (updates.imageDataUrl !== undefined) {
                    if (updates.imageDataUrl === null || updates.imageDataUrl === '') {
                        delete next.imageDataUrl;
                    } else {
                        next.imageDataUrl = updates.imageDataUrl;
                    }
                }
                return next;
            })
        );
        this.persist();
    }

    updateCommitment(
        wishId: string,
        updates: { title?: string; duration?: number; startDate?: number }
    ): void {
        this.commitmentsSignal.update((list) =>
            list.map((c) =>
                c.wishId === wishId
                    ? {
                          ...c,
                          ...(updates.title !== undefined && { title: updates.title }),
                          ...(updates.duration !== undefined && { duration: updates.duration }),
                          ...(updates.startDate !== undefined && {
                              startDate: getStartOfDay(updates.startDate)
                          }),
                          ...computeProgress({
                              ...c,
                              ...(updates.duration !== undefined && { duration: updates.duration }),
                              ...(updates.startDate !== undefined && {
                                  startDate: getStartOfDay(updates.startDate)
                              })
                          })
                      }
                    : c
            )
        );
        this.persist();
    }

    /**
     * Returns true if a missed day was detected and streak was reset.
     */
    checkIn(commitmentId: string): { completed: boolean; missedDayReset: boolean } {
        const commitments = this.commitmentsSignal();
        const commitment = commitments.find((c) => c.id === commitmentId);
        if (!commitment || commitment.completed) {
            return { completed: false, missedDayReset: false };
        }

        const now = Date.now();
        const todayStart = getStartOfDay(now);
        const commitmentStart = getStartOfDay(commitment.startDate);
        if (todayStart < commitmentStart) {
            return { completed: false, missedDayReset: false };
        }
        const alreadyChecked = (commitment.checkIns ?? []).some((d) =>
            isSameCalendarDay(d, todayStart)
        );
        if (alreadyChecked) {
            return { completed: false, missedDayReset: false };
        }

        this.commitmentsSignal.update((list) =>
            list.map((c) => {
                if (c.id !== commitmentId) return c;
                const next: Commitment = {
                    ...c,
                    checkIns: uniqSorted([...(c.checkIns ?? []), todayStart])
                };
                return { ...next, ...computeProgress(next) };
            })
        );
        this.persist();
        const updated = this.commitmentsSignal().find((c) => c.id === commitmentId);
        return { completed: !!updated?.completed, missedDayReset: false };
    }

    toggleCheckIn(commitmentId: string, day: number, checked: boolean): void {
        const todayStart = getStartOfDay(Date.now());
        const dayStart = getStartOfDay(day);
        if (dayStart > todayStart) return;

        this.commitmentsSignal.update((list) =>
            list.map((c) => {
                if (c.id !== commitmentId) return c;
                const current = uniqSorted((c.checkIns ?? []).map(getStartOfDay));
                const nextCheckIns = checked
                    ? uniqSorted([...current, dayStart])
                    : current.filter((d) => d !== dayStart);
                const next: Commitment = { ...c, checkIns: nextCheckIns };
                return { ...next, ...computeProgress(next) };
            })
        );
        this.persist();
    }

    markWishFulfilled(wishId: string, fulfilledDate?: number, note?: string): void {
        const when = fulfilledDate ?? Date.now();
        this.wishesSignal.update((list) =>
            list.map((w) =>
                w.id === wishId
                    ? { ...w, fulfilled: true, fulfilledDate: when, fulfilledNote: note }
                    : w
            )
        );
        this.persist();
    }

    deleteWish(wishId: string): void {
        this.wishesSignal.update((list) => list.filter((w) => w.id !== wishId));
        this.commitmentsSignal.update((list) => list.filter((c) => c.wishId !== wishId));
        this.persist();
    }
}
