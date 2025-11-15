import { type Request, type Response, Router } from "express";
import type { RendezVousService } from "../domain/rendezvous.service";
import { extractBearerToken, verifyJwtToken } from "../../../lib/auth";

export function createRendezVousController(service: RendezVousService): Router {
	const router = Router();

	const authenticate = (req: Request, res: Response) => {
		const token = extractBearerToken(req.headers.authorization);
		if (!token) {
			res.status(401).json({ error: "Token d'authentification manquant" });
			return null;
		}
		const payload = verifyJwtToken(token);
		if (!payload) {
			res.status(401).json({ error: "Token d'authentification invalide" });
			return null;
		}
		return payload;
	};

	router.post("/", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const rendezVous = await service.creerRendezVous(req.body);
			res.status(201).json(rendezVous);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.get("/:id", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const rendezVous = await service.trouverParId(req.params.id);
			if (!rendezVous) {
				return res.status(404).json({ error: "Rendez-vous introuvable" });
			}
			const canAccess = payload.id === rendezVous.idPatient || payload.id === rendezVous.idMedecin;
			if (!canAccess) {
				return res.status(403).json({ error: "Accès refusé" });
			}
			res.json(rendezVous);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.get("/patients/:idPatient", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		const canAccess = payload.id === req.params.idPatient;
		if (!canAccess) {
			return res.status(403).json({ error: "Accès refusé" });
		}
		try {
			const rendezVous = await service.trouverParPatient(req.params.idPatient);
			res.json(rendezVous);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.get("/medecins/:idMedecin", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		const canAccess = payload.id === req.params.idMedecin;
		if (!canAccess) {
			return res.status(403).json({ error: "Accès refusé" });
		}
		try {
			const rendezVous = await service.trouverParMedecin(req.params.idMedecin);
			res.json(rendezVous);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.put("/:id", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const rendezVous = await service.mettreAJour({ ...req.body, id: req.params.id });
			res.json(rendezVous);
		} catch (error) {
			if ((error as Error).message === "Rendez-vous introuvable") {
				return res.status(404).json({ error: (error as Error).message });
			}
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.patch("/:id/statut", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const rendezVous = await service.mettreAJourStatut(req.params.id, req.body.statut);
			res.json(rendezVous);
		} catch (error) {
			if ((error as Error).message === "Rendez-vous introuvable") {
				return res.status(404).json({ error: (error as Error).message });
			}
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.delete("/:id", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			await service.supprimer(req.params.id);
			res.status(204).send();
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	return router;
}

