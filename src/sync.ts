// tslint:disable: no-unsafe-any
import { IKeyValueStoreSync } from "@konceiver/kv";

export abstract class StoreSync<K, T> implements IKeyValueStoreSync<K, T> {
	// @ts-ignore
	public constructor(
		protected readonly store: Map<K, T>,
		protected readonly uri: string
	) {
		this.load();
	}

	public all(): [K, T][] {
		return [...this.store.entries()];
	}

	public keys(): K[] {
		return [...this.store.keys()];
	}

	public values(): T[] {
		return [...this.store.values()];
	}

	public get(key: K): T | undefined {
		return this.store.get(key);
	}

	public getMany(keys: K[]): (T | undefined)[] {
		return [...keys].map((key: K) => this.get(key));
	}

	public pull(key: K): T | undefined {
		const item: T | undefined = this.get(key);

		this.forget(key);

		return item;
	}

	public pullMany(keys: K[]): (T | undefined)[] {
		const items: (T | undefined)[] = this.getMany(keys);

		this.forgetMany(keys);

		return items;
	}

	public put(key: K, value: T): boolean {
		this.store.set(key, value);

		this.dump();

		return this.has(key);
	}

	public putMany(values: [K, T][]): boolean[] {
		return values.map((value: [K, T]) => this.put(value[0], value[1]));
	}

	public has(key: K): boolean {
		return this.store.has(key);
	}

	public hasMany(keys: K[]): boolean[] {
		return [...keys].map((key: K) => this.has(key));
	}

	public missing(key: K): boolean {
		return !this.has(key);
	}

	public missingMany(keys: K[]): boolean[] {
		return [...keys].map((key: K) => this.missing(key));
	}

	public forget(key: K): boolean {
		const deleted: boolean = this.store.delete(key);

		this.dump();

		return deleted;
	}

	public forgetMany(keys: K[]): boolean[] {
		return [...keys].map((key: K) => this.forget(key));
	}

	public flush(): boolean {
		this.store.clear();

		this.dump();

		return this.count() === 0;
	}

	public count(): number {
		return this.store.size;
	}

	public isEmpty(): boolean {
		return this.count() === 0;
	}

	public isNotEmpty(): boolean {
		return !this.isEmpty();
	}

	protected abstract dump(): void;
	protected abstract load(): void;
}
