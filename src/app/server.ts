
import express from "express";

import usersRouter from "../features/users";
import pharmacieRouter from "../features/pharmacie";
import rendezvousRouter from "../features/rendezvous";

export function createApp() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/users", usersRouter);
	app.use("/pharmacie", pharmacieRouter);
	app.use("/rendezvous", rendezvousRouter);

	app.use((req, res) => {
		res.status(404).json({ error: "Route non trouvée" });
	});

	app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		console.error("Erreur serveur :", err);
		res.status(500).json({ error: "Erreur interne du serveur" });
	});

	return app;
}

const app = createApp();
export default app;
