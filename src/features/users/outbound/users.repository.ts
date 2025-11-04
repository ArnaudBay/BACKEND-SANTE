import type { User, UserRepository } from "../domain/users.entity";

export class SimpleUserRepository implements UserRepository {
	private bd: User[] = [];

	create(user: User): User {
		this.bd.push(user);
		return user;
	}

	findByEmail(email: string): User | null {
		const user = this.bd.find((user) => user.email === email);
		return user || null;
	}

	findById(id: string): User | null {
		const user = this.bd.find((user) => user.id === id);
		return user || null;
	}

	findAll(): User[] {
		return this.bd;
	}

	delete(id: string): void {
		this.bd = this.bd.filter((user) => user.id !== id);
	}
}
