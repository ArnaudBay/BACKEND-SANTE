import type { Profile, ProfileRepository } from "./profile.entity";

export class ProfileService {
	constructor(private repository: ProfileRepository) {}

	async createProfile(profile: Profile): Promise<Profile> {
		return await this.repository.create(profile);
	}

	async getProfileById(id: string): Promise<Profile | null> {
		return await this.repository.findById(id);
	}

	async updateProfile(profile: Profile): Promise<Profile> {
		return await this.repository.update(profile);
	}

	async deleteProfile(id: string): Promise<void> {
		await this.repository.delete(id);
	}

	async getAllProfiles(): Promise<Profile[]> {
		return await this.repository.findAll();
	}

	async getProfilesByRole(role: Profile["role"]): Promise<Profile[]> {
		return await this.repository.findByRole(role);
	}
}
