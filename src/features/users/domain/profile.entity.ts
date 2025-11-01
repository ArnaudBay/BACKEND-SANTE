export interface Profile {
	firstName: string;
	lastName: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}

export interface ProfileRepository {
	create(profile: Profile): Profile;
	findById(id: string): Profile | null;
	update(profile: Profile): Profile;
	delete(id: string): void;
}