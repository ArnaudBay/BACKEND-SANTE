import type { User, UserRepository } from "../domain/users.entity";

export class SimpleUserRepository implements UserRepository {
	private bd: User[] = [];

	async create(user: User): Promise<void> {
		this.bd.push(user);
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.bd.find((item) => item.email === email);
		return user ?? null;
	}

	async findById(id: string): Promise<User | null> {
		const user = this.bd.find((item) => item.id === id);
		return user ?? null;
	}

	async delete(id: string): Promise<void> {
		this.bd = this.bd.filter((user) => user.id !== id);
	}
}
