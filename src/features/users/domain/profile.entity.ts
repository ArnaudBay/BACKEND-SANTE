export type UserRole = "patient" | "admin" | "medecin";

export interface Profile {
	id: string;
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	country: string;
	role: UserRole;
}

export interface ProfileRepository {
	create(profile: Profile): Profile;
	findById(id: string): Profile | null;
	update(profile: Profile): Profile;
	delete(id: string): void;
	findByRole(role: UserRole): Profile[];    // c'est pour le filtrage des roles de utilisateurs
}
