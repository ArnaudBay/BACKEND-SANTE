import type { Profile, ProfileRepository, UserRole } from "../domain/profile.entity";

export class InMemoryProfileRepository implements ProfileRepository {
	private readonly store = new Map<string, Profile>();

	create(profile: Profile): Profile {
		this.store.set(profile.id, { ...profile });
		return profile;
	}

	findById(id: string): Profile | null {
		return this.store.get(id) ?? null;
	}

	update(profile: Profile): Profile {
		if (!this.store.has(profile.id)) {
			throw new Error("Profil introuvable");
		}
		this.store.set(profile.id, { ...profile });
		return profile;
	}

	delete(id: string): void {
		this.store.delete(id);
	}

	findAll(): Profile[] {
		return Array.from(this.store.values());
	}

	findByRole(role: UserRole): Profile[] {
		return Array.from(this.store.values()).filter((profile) => profile.role === role);
	}
}

