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
        this.commitmentsSignal.set(this.storage.loadCommitments());
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
                          ...(() => {
                              if (updates.startDate === undefined) {
                                  const nextDuration = updates.duration ?? c.duration;
                                  const nextCompleted = c.streak >= nextDuration;
                                  return nextCompleted === c.completed
                                      ? {}
                                      : { completed: nextCompleted };
                              }

                              const nextStartDate = getStartOfDay(updates.startDate);
                              const nextDuration = updates.duration ?? c.duration;

                              if (c.lastCheckIn == null) {
                                  return {
                                      startDate: nextStartDate,
                                      streak: 0,
                                      completed: false
                                  };
                              }

                              const lastCheckStart = getStartOfDay(c.lastCheckIn);
                              if (lastCheckStart < nextStartDate) {
                                  return {
                                      startDate: nextStartDate,
                                      streak: 0,
                                      lastCheckIn: undefined,
                                      completed: false
                                  };
                              }

                              const maxPossibleStreak = daysBetween(nextStartDate, lastCheckStart) + 1;
                              const nextStreak = Math.max(0, Math.min(c.streak, maxPossibleStreak));
                              return {
                                  startDate: nextStartDate,
                                  streak: nextStreak,
                                  ...(nextStreak === 0 ? { lastCheckIn: undefined } : {}),
                                  completed: nextStreak >= nextDuration
                              };
                          })()
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
        const lastCheck = commitment.lastCheckIn;
        let missedDayReset = false;

        if (lastCheck != null) {
            if (isSameCalendarDay(lastCheck, now)) {
                // Already checked today - no-op
                return { completed: false, missedDayReset: false };
            }
            if (daysBetween(lastCheck, now) > 1) {
                missedDayReset = true;
                // Reset: streak = 0, startDate = today
                this.commitmentsSignal.update((list) =>
                    list.map((c) =>
                        c.id === commitmentId
                            ? {
                                  ...c,
                                  streak: 0,
                                  startDate: todayStart,
                                  lastCheckIn: todayStart
                              }
                            : c
                    )
                );
                this.persist();
                return { completed: false, missedDayReset: true };
            }
        }

        const newStreak = commitment.streak + 1;
        const isCompleted = newStreak >= commitment.duration;

        this.commitmentsSignal.update((list) =>
            list.map((c) =>
                c.id === commitmentId
                    ? {
                          ...c,
                          streak: newStreak,
                          lastCheckIn: todayStart,
                          completed: isCompleted
                      }
                    : c
            )
        );
        this.persist();
        return { completed: isCompleted, missedDayReset: false };
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
