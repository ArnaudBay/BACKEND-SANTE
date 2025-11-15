import type { Medicine, PharmacyRepository } from "./pharmacy.entity";

export class PharmacyService {
	constructor(private readonly repository: PharmacyRepository) {}

	async createMedicine(medicine: Medicine): Promise<Medicine> {
		this.validateMedicine(medicine);
		return await this.repository.create(medicine);
	}

	async getMedicineById(id: string): Promise<Medicine | null> {
		if (!id.trim()) {
			throw new Error("Identifiant du médicament manquant");
		}
		return await this.repository.findById(id);
	}

	async getAllMedicines(): Promise<Medicine[]> {
		return await this.repository.findAll();
	}

	async updateMedicine(medicine: Medicine): Promise<Medicine> {
		this.validateMedicine(medicine);
		return await this.repository.update(medicine);
	}

	async deleteMedicine(id: string): Promise<void> {
		if (!id.trim()) {
			throw new Error("Identifiant du médicament manquant");
		}
		await this.repository.delete(id);
	}

	private validateMedicine(medicine: Medicine): void {
		if (!medicine.id.trim()) {
			throw new Error("L'identifiant du médicament est obligatoire");
		}
		if (!medicine.name.trim()) {
			throw new Error("Le nom du médicament est obligatoire");
		}
		if (!medicine.category.trim()) {
			throw new Error("La catégorie du médicament est obligatoire");
		}
		if (medicine.price < 0) {
			throw new Error("Le prix du médicament ne peut pas être négatif");
		}
		if (!Number.isFinite(medicine.price)) {
			throw new Error("Le prix du médicament doit être un nombre valide");
		}
		if (!Number.isInteger(medicine.stock) || medicine.stock < 0) {
			throw new Error("Le stock du médicament doit être un entier positif");
		}
		if (!medicine.expirationDate.trim() || Number.isNaN(Date.parse(medicine.expirationDate))) {
			throw new Error("La date d'expiration du médicament est invalide");
		}
	}
}

