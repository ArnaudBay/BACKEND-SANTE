import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import type { EmailSender } from "../../messaging/domain/email.model";
import { createJwtToken, verifyJwtToken } from "../../../lib/auth";
import type { LoginOutput, User, UserRepository } from "./users.entity";

interface CreateUserInput {
	email: string;
	password: string;
}

export class UserService {
	private repo: UserRepository;
	private emailSender: EmailSender;

	constructor(repo: UserRepository, emailSender: EmailSender) {
		this.repo = repo;
		this.emailSender = emailSender;
	}

	async createUser(user: CreateUserInput): Promise<User> {
		const existingUser = await this.repo.findByEmail(user.email);
		if (existingUser != null) {
			throw new Error("ERR_EMAIL_ALREADY_TAKEN");
		}

		const hashedPassword = await bcrypt.hash(user.password, 10);

		const entity: User = {
			id: randomUUID(),
			email: user.email,
			password: hashedPassword,
			role: null,
			createdAt: new Date()
		};

		await this.repo.create(entity);

		await this.emailSender.sendEmail({
			to: entity.email,
			subject: "Bienvenue sur l'application",
			message: "Bonjour ! Votre compte a été créé avec succès. Vous pouvez désormais vous connecter à l'application."
		});

		return entity;
	}

	verifyToken(token: string): User | null {
		const decoded = verifyJwtToken(token);
		if (decoded == null) {
			return null;
		}
		return {
			id: decoded.id,
			email: decoded.email,
			password: "",
			role: "user",
			createdAt: new Date()
		};
	}

	async deleteUser(id: string): Promise<void> {
		await this.repo.delete(id);
	}

	async loginUser(email: string, password: string): Promise<LoginOutput | null> {
		const user = await this.repo.findByEmail(email);
		if (!user) {
			return null;
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return null;
		}

		const token = createJwtToken(user.id, user.email, "user");
		return { token };
	}
}
