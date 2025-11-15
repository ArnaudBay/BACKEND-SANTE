import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_example";
const DEFAULT_SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);

export interface AuthenticatedJwtPayload extends JwtPayload {
	id: string;
	email: string;
	role: string;
}

export function createJwtToken(id: string, email: string, role: string): string {
	return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): AuthenticatedJwtPayload | null {
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		if (typeof payload === "string") {
			return null;
		}
		if (!payload.id || !payload.email || !payload.role) {
			return null;
		}
		return payload as AuthenticatedJwtPayload;
	} catch {
		return null;
	}
}

export async function hashPassword(password: string, saltRounds = DEFAULT_SALT_ROUNDS): Promise<string> {
	if (!password.trim()) {
		throw new Error("Le mot de passe est obligatoire");
	}
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	if (!hashedPassword) {
		return false;
	}
	return await bcrypt.compare(password, hashedPassword);
}

export function extractBearerToken(header?: string): string | null {
	if (!header) {
		return null;
	}
	const [scheme, token] = header.split(" ");
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return null;
	}
	return token;
}
