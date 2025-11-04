export type StatutRendezVous = "en_attente" | "confirme" | "annule" | "termine";

export interface RendezVous {
	id: string;
	idPatient: string;        
	idMedecin: string;        
	date: string;             
	heure: string;           
	motif: string;            
	statut: StatutRendezVous; 
	notes?: string;          
}

export interface RendezVousRepository {
	creer(rendezVous: RendezVous): Promise<RendezVous>;
	trouverParId(id: string): Promise<RendezVous | null>;
	trouverParPatient(idPatient: string): Promise<RendezVous[]>;
	trouverParMedecin(idMedecin: string): Promise<RendezVous[]>;
	mettreAJour(rendezVous: RendezVous): Promise<RendezVous>;
	supprimer(id: string): Promise<void>;
}
