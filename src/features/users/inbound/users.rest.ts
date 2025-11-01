import { type Request, type Response, Router } from "express";
import type { UserService } from "../domain/users.service";

export function createUserController(service: UserService): Router {
	const router = Router();

	router.post("/profiles", async (req: Request, res: Response) => {
        const profile = req.body;
        const createdProfile = await service.createProfile(profile);
        res.status(201).json(createdProfile);
    });
	return router;
}
