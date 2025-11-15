import type { RendezVous, RendezVousRepository } from "../domain/rendezvous.entity";

export class InMemoryRendezVousRepository implements RendezVousRepository {
	private readonly store = new Map<string, RendezVous>();

	async creer(rendezVous: RendezVous): Promise<RendezVous> {
		this.store.set(rendezVous.id, { ...rendezVous });
		return rendezVous;
	}

	async trouverParId(id: string): Promise<RendezVous | null> {
		return this.store.get(id) ?? null;
	}

	async trouverParPatient(idPatient: string): Promise<RendezVous[]> {
		return Array.from(this.store.values()).filter((item) => item.idPatient === idPatient);
	}

	async trouverParMedecin(idMedecin: string): Promise<RendezVous[]> {
		return Array.from(this.store.values()).filter((item) => item.idMedecin === idMedecin);
	}

	async mettreAJour(rendezVous: RendezVous): Promise<RendezVous> {
		if (!this.store.has(rendezVous.id)) {
			throw new Error("Rendez-vous introuvable");
		}
		this.store.set(rendezVous.id, { ...rendezVous });
		return rendezVous;
	}

	async supprimer(id: string): Promise<void> {
		this.store.delete(id);
	}
}

