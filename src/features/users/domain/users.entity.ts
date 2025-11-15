export interface User {
	id: string;
	email: string;
	password: string;
	role: string | null;
	createdAt: Date;
}

export interface LoginOutput {
	token: string;
}

export interface UserRepository {
	create(user: User): Promise<void>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;
	delete(id: string): Promise<void>;
}
