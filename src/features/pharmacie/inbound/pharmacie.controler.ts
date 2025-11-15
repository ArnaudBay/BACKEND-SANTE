import { type Request, type Response, Router } from "express";
import type { PharmacyService } from "../domain/pharmacy.service";
import { extractBearerToken, verifyJwtToken } from "../../../lib/auth";

export function createPharmacieController(service: PharmacyService): Router {
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

	router.get("/medicaments", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const medicaments = await service.getAllMedicines();
			res.json(medicaments);
		} catch (error) {
			res.status(500).json({ error: "Erreur lors de la récupération des médicaments" });
		}
	});

	router.get("/medicaments/:id", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const medicament = await service.getMedicineById(req.params.id);
			if (!medicament) {
				return res.status(404).json({ error: "Médicament introuvable" });
			}
			res.json(medicament);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.post("/medicaments", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const created = await service.createMedicine(req.body);
			res.status(201).json(created);
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.put("/medicaments/:id", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			const updatePayload = { ...req.body, id: req.params.id };
			const updated = await service.updateMedicine(updatePayload);
			res.json(updated);
		} catch (error) {
			if ((error as Error).message === "Médicament introuvable") {
				return res.status(404).json({ error: (error as Error).message });
			}
			res.status(400).json({ error: (error as Error).message });
		}
	});

	router.delete("/medicaments/:id", async (req: Request, res: Response) => {
		const payload = authenticate(req, res);
		if (!payload) {
			return;
		}
		try {
			await service.deleteMedicine(req.params.id);
			res.status(204).send();
		} catch (error) {
			res.status(400).json({ error: (error as Error).message });
		}
	});

	return router;
}

