import { type Request, type Response, Router } from "express";
import type { UserService } from "../domain/users.service";

export function createUserController(service: UserService): Router {
  const router = Router();

  //       ça c'est pour la creation d'un profil (admin, patient, médecin) 
  router.post("/profiles", async (req: Request, res: Response) => {
    try {
      const createdProfile = await service.createProfile(req.body);
      res.status(201).json(createdProfile);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création du profil" });
    }
  });

  //        ici c'est pour Lister tous les profils de mes utilisateurs
  router.get("/profiles", async (_req: Request, res: Response) => {
    try {
      const profiles = await service.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des profils" });
    }
  });

  return router;
}
