import type { Profile } from "./profile.entity";
import type { ProfileRepository } from "./profile.entity";

export class UserService {
	constructor(private repository: ProfileRepository) {}

	async createProfile(profile: Profile): Promise<Profile> {
		return await this.repository.create(profile);
	}



	async updateProfile(profile: Profile): Promise<Profile> {
		return await this.repository.update(profile);
	}

	async deleteProfile(id: string): Promise<void> {
		await this.repository.delete(id);
	}


	getAllProfiles() {
  return this.repository.findAll();
}

}
