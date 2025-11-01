export interface User {
	id: string;
	email: string;
	password: string;
	role?: string;
}

export interface LoginOutput {
	token: string;
}

export interface UserRepository {
	create(user: User): User;
	findByEmail(email: string): User | null;
	delete(id: string): void;
}
