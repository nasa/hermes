/**
 * DualKeyMap indexes a set of items by a custom key like a normal Map
 * and a second key that is embedded in the item (usually an ID).
 * 
 * K1 can be any unique key set when adding items
 * K2 is a field inside of the value
 */
export class DualKeyMap<
    V,
    K2 extends keyof V
> {
    private byK1 = new Map<string, V>();
    private byK2 = new Map<V[K2], V>();

    constructor(
        readonly k2: K2,
        initial?: Iterable<[string, V]>
    ) {
        if (initial) {
            for (const [k1, v] of initial) {
                this.byK1.set(k1, v);
                this.byK2.set(v[k2], v);
            }
        }
    }

    /**
     * Look up value by the primary key
     * @param k1 Primary key
     * @returns value or undefined if not found
     */
    get(k1: string): V | undefined {
        return this.byK1.get(k1);
    }

    map<T>(cb: (value: V, index: number) => T): T[] {
        const out: T[] = [];
        let i = 0;
        for (const iter of this.values()) {
            out.push(cb(iter, i++));
        }

        return out;
    }

    /**
     * Lookup value by the secondary key
     * @param k2 Secondary key
     * @returns value or undefined if not found
     */
    getK2(k2: V[K2]): V | undefined {
        return this.byK2.get(k2);
    }

    has(k1: string): boolean {
        return this.byK1.has(k1);
    }

    hasK2(k2: V[K2]): boolean {
        return this.byK2.has(k2);
    }

    set(k1: string, item: V) {
        if (this.has(k1)) {
            throw new Error(`Overlapping keys (1): ${k1}`);
        }

        if (this.hasK2(item[this.k2])) {
            throw new Error(`Overlapping keys (2): ${item[this.k2]}`);
        }

        this.byK1.set(k1, item);
        this.byK2.set(item[this.k2], item);
    }

    keys() {
        return this.byK1.keys();
    }

    keys2() {
        return this.byK2.keys();
    }

    entries() {
        return Array.from(this.byK1.entries());
    }

    values(): Iterable<V> {
        return this.byK1.values();
    }

    clear() {
        this.byK1.clear();
        this.byK2.clear();
    }
}
