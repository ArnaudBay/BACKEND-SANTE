import { type Request, type Response, Router } from "express";
import type { UserService } from "../domain/users.service";

function extractBearerToken(header?: string): string | null {
	if (!header) {
		return null;
	}
	const [scheme, token] = header.split(" ");
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return null;
	}
	return token;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createUserController(service: UserService): Router {
	const router = Router();

	router.post("/", async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body ?? {};
			if (!email || !password) {
				return res.status(400).json({ error: "Email et mot de passe requis" });
			}
			if (!EMAIL_REGEX.test(email)) {
				return res.status(400).json({ error: "Email invalide" });
			}
			if (password.length < 8) {
				return res.status(400).json({ error: "Mot de passe trop court" });
			}
			const user = await service.createUser({ email, password });
			return res.status(201).json({
				id: user.id,
				email: user.email,
				password: user.password,
				role: user.role,
				createdAt: user.createdAt.toISOString()
			});
		} catch (error) {
			if ((error as Error).message === "ERR_EMAIL_ALREADY_TAKEN") {
				return res.status(409).json({ error: "Email déjà utilisé" });
			}
			return res.status(400).json({ error: (error as Error).message });
		}
	});

	router.post("/login", async (req: Request, res: Response) => {
		const { email, password } = req.body ?? {};
		if (!email || !password) {
			return res.status(400).json({ error: "Email et mot de passe requis" });
		}

		const result = await service.loginUser(email, password);
		if (!result) {
			return res.status(401).json({ error: "Identifiants invalides" });
		}

		return res.status(200).json(result);
	});

	router.delete("/:id", async (req: Request, res: Response) => {
		const token = extractBearerToken(req.headers.authorization);
		if (!token) {
			return res.status(401).json({ error: "Token requis" });
		}

		const tokenUser = service.verifyToken(token);
		if (!tokenUser || tokenUser.id !== req.params.id) {
			return res.status(401).json({ error: "Accès non autorisé" });
		}

		await service.deleteUser(req.params.id);
		return res.status(204).send();
	});

	return router;
}
