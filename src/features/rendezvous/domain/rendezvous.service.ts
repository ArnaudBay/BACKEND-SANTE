import type { RendezVous, RendezVousRepository, StatutRendezVous } from "./rendezvous.entity";

export class RendezVousService {
	constructor(private readonly repository: RendezVousRepository) {}

	async creerRendezVous(rendezVous: RendezVous): Promise<RendezVous> {
		this.validateRendezVous(rendezVous);
		return await this.repository.creer(rendezVous);
	}

	async trouverParId(id: string): Promise<RendezVous | null> {
		if (!id.trim()) {
			throw new Error("Identifiant du rendez-vous manquant");
		}
		return await this.repository.trouverParId(id);
	}

	async trouverParPatient(idPatient: string): Promise<RendezVous[]> {
		if (!idPatient.trim()) {
			throw new Error("Identifiant patient manquant");
		}
		return await this.repository.trouverParPatient(idPatient);
	}

	async trouverParMedecin(idMedecin: string): Promise<RendezVous[]> {
		if (!idMedecin.trim()) {
			throw new Error("Identifiant médecin manquant");
		}
		return await this.repository.trouverParMedecin(idMedecin);
	}

	async mettreAJour(rendezVous: RendezVous): Promise<RendezVous> {
		this.validateRendezVous(rendezVous);
		return await this.repository.mettreAJour(rendezVous);
	}

	async mettreAJourStatut(id: string, statut: StatutRendezVous): Promise<RendezVous> {
		if (!id.trim()) {
			throw new Error("Identifiant du rendez-vous manquant");
		}
		if (!this.isValidStatut(statut)) {
			throw new Error("Statut de rendez-vous invalide");
		}
		const rendezVous = await this.repository.trouverParId(id);
		if (!rendezVous) {
			throw new Error("Rendez-vous introuvable");
		}
		return await this.repository.mettreAJour({ ...rendezVous, statut });
	}

	async supprimer(id: string): Promise<void> {
		if (!id.trim()) {
			throw new Error("Identifiant du rendez-vous manquant");
		}
		await this.repository.supprimer(id);
	}

	private validateRendezVous(rendezVous: RendezVous): void {
		if (!rendezVous.id.trim()) {
			throw new Error("L'identifiant du rendez-vous est obligatoire");
		}
		if (!rendezVous.idPatient.trim()) {
			throw new Error("L'identifiant du patient est obligatoire");
		}
		if (!rendezVous.idMedecin.trim()) {
			throw new Error("L'identifiant du médecin est obligatoire");
		}
		if (!rendezVous.date.trim() || Number.isNaN(Date.parse(rendezVous.date))) {
			throw new Error("La date du rendez-vous est invalide");
		}
		if (!rendezVous.heure.trim()) {
			throw new Error("L'heure du rendez-vous est obligatoire");
		}
		if (!rendezVous.motif.trim()) {
			throw new Error("Le motif du rendez-vous est obligatoire");
		}
		if (!this.isValidStatut(rendezVous.statut)) {
			throw new Error("Statut de rendez-vous invalide");
		}
	}

	private isValidStatut(statut: string): statut is StatutRendezVous {
		return ["en_attente", "confirme", "annule", "termine"].includes(statut);
	}
}

