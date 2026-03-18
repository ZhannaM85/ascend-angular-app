import { computed, inject, Injectable, signal } from '@angular/core';
import type { Commitment } from '../models/commitment.model';
import type { Reflection } from '../models/reflection.model';
import type { Wish } from '../models/wish.model';
import { StorageService } from './storage.service';

/**
 * Generates a short random alphanumeric ID.
 *
 * @returns A random string of 7 alphanumeric characters.
 */
function generateId(): string {
    return Math.random().toString(36).slice(2, 9);
}

/**
 * Returns the timestamp for midnight (00:00:00) of the given date in local timezone.
 *
 * @param ts - Timestamp in milliseconds.
 * @returns Timestamp for midnight of that day in local timezone.
 */
function getStartOfDay(ts: number): number {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

/**
 * Returns true if both timestamps fall on the same calendar day in local timezone.
 *
 * @param a - First timestamp in milliseconds.
 * @param b - Second timestamp in milliseconds.
 * @returns True if same calendar day.
 */
function isSameCalendarDay(a: number, b: number): boolean {
    return getStartOfDay(a) === getStartOfDay(b);
}

/**
 * Returns a new array with unique values sorted ascending.
 *
 * @param nums - Array of numbers.
 * @returns New array with duplicates removed and sorted.
 */
function uniqSorted(nums: number[]): number[] {
    return [...new Set(nums)].sort((a, b) => a - b);
}

/**
 * Computes streak, completed status, and lastCheckIn for a commitment.
 *
 * @param c - The commitment to compute progress for.
 * @returns Object with streak, completed, and lastCheckIn.
 */
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

/**
 * Normalizes check-ins and computes progress; migrates legacy commitment format.
 *
 * @param raw - Raw commitment data.
 * @returns Migrated commitment with normalized check-ins.
 */
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

    public readonly wishes = this.wishesSignal.asReadonly();

    public readonly commitments = this.commitmentsSignal.asReadonly();

    public readonly reflections = this.reflectionsSignal.asReadonly();

    public readonly activeWishes = computed(() =>
        this.wishesSignal().filter((w) => !w.fulfilled)
    );

    public readonly fulfilledWishes = computed(() =>
        this.wishesSignal().filter((w) => w.fulfilled)
    );

    constructor() {
        this.wishesSignal.set(this.storage.loadWishes());
        this.commitmentsSignal.set(this.storage.loadCommitments().map(migrateCommitment));
        this.reflectionsSignal.set(this.storage.loadReflections());
    }

    /**
     * Persists all state to storage.
     */
    private persist(): void {
        this.storage.saveWishes(this.wishesSignal());
        this.storage.saveCommitments(this.commitmentsSignal());
        this.storage.saveReflections(this.reflectionsSignal());
    }

    /**
     * Returns reflections for a wish, sorted by date descending.
     *
     * @param wishId - The wish ID.
     * @returns Array of reflections for the wish.
     */
    public getReflectionsForWish(wishId: string): Reflection[] {
        return this.reflectionsSignal()
            .filter((r) => r.wishId === wishId)
            .sort((a, b) => b.date - a.date);
    }

    /**
     * Adds a reflection for a wish. Uses today's date if not provided.
     *
     * @param wishId - The wish ID.
     * @param text - Reflection text.
     * @param date - Optional timestamp for the reflection date.
     * @returns The created reflection.
     */
    public addReflection(wishId: string, text: string, date?: number): Reflection {
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

    /**
     * Updates the text of an existing reflection.
     *
     * @param reflectionId - The reflection ID.
     * @param text - New reflection text.
     */
    public updateReflection(reflectionId: string, text: string): void {
        const trimmed = text.trim();
        this.reflectionsSignal.update((list) =>
            list.map((r) =>
                r.id === reflectionId ? { ...r, text: trimmed } : r
            )
        );
        this.persist();
    }

    /**
     * Deletes a reflection by ID.
     *
     * @param reflectionId - The reflection ID.
     */
    public deleteReflection(reflectionId: string): void {
        this.reflectionsSignal.update((list) =>
            list.filter((r) => r.id !== reflectionId)
        );
        this.persist();
    }

    /**
     * Creates a new wish with an optional commitment.
     *
     * @param title - Wish title.
     * @param commitmentTitle - Commitment title.
     * @param duration - Commitment duration in days.
     * @param description - Optional wish description.
     * @param commitmentStartDate - Optional commitment start timestamp.
     * @param imageDataUrl - Optional base64 image data.
     * @returns The created wish.
     */
    public addWish(
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

    /**
     * Returns the commitment for a wish, or undefined if none.
     *
     * @param wishId - The wish ID.
     * @returns The commitment or undefined.
     */
    public getCommitmentForWish(wishId: string): Commitment | undefined {
        return this.commitmentsSignal().find((c) => c.wishId === wishId);
    }

    /**
     * Returns a wish by ID, or undefined if not found.
     *
     * @param id - The wish ID.
     * @returns The wish or undefined.
     */
    public getWish(id: string): Wish | undefined {
        return this.wishesSignal().find((w) => w.id === id);
    }

    /**
     * Updates a wish's title, description, and/or image.
     *
     * @param wishId - The wish ID.
     * @param updates - Partial updates to apply.
     */
    public updateWish(
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

    /**
     * Updates a commitment's title, duration, and/or start date.
     *
     * @param wishId - The wish ID.
     * @param updates - Partial updates to apply.
     */
    public updateCommitment(
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
     * Records a check-in for today. Returns completion status and whether streak was reset.
     *
     * @param commitmentId - The commitment ID.
     * @returns Object with completed and missedDayReset flags.
     */
    public checkIn(commitmentId: string): { completed: boolean; missedDayReset: boolean } {
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

    /**
     * Toggles a past day's check-in status. Only allows past days.
     *
     * @param commitmentId - The commitment ID.
     * @param day - Timestamp for the day.
     * @param checked - Whether the day should be checked.
     */
    public toggleCheckIn(commitmentId: string, day: number, checked: boolean): void {
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

    /**
     * Marks a wish as fulfilled with optional date and note.
     *
     * @param wishId - The wish ID.
     * @param fulfilledDate - Optional fulfillment timestamp.
     * @param note - Optional fulfillment note.
     */
    public  markWishFulfilled(wishId: string, fulfilledDate?: number, note?: string): void {
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

    /**
     * Deletes a wish and its associated commitment.
     *
     * @param wishId - The wish ID.
     */
    public deleteWish(wishId: string): void {
        this.wishesSignal.update((list) => list.filter((w) => w.id !== wishId));
        this.commitmentsSignal.update((list) => list.filter((c) => c.wishId !== wishId));
        this.persist();
    }
}
