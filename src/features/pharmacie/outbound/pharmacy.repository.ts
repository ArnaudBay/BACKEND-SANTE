import type { Medicine, PharmacyRepository } from "../domain/pharmacy.entity";

export class InMemoryPharmacyRepository implements PharmacyRepository {
	private readonly store = new Map<string, Medicine>();

	async create(medicine: Medicine): Promise<Medicine> {
		this.store.set(medicine.id, { ...medicine });
		return medicine;
	}

	async findById(id: string): Promise<Medicine | null> {
		return this.store.get(id) ?? null;
	}

	async findAll(): Promise<Medicine[]> {
		return Array.from(this.store.values());
	}

	async update(medicine: Medicine): Promise<Medicine> {
		if (!this.store.has(medicine.id)) {
			throw new Error("Médicament introuvable");
		}
		this.store.set(medicine.id, { ...medicine });
		return medicine;
	}

	async delete(id: string): Promise<void> {
		this.store.delete(id);
	}
}

