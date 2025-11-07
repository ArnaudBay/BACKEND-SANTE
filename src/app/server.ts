
import express from "express";


import usersRouter from "../features/users";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/users", usersRouter);        


app.use((req, res) => {
	res.status(404).json({ error: "Route non trouvée" });
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error("Erreur serveur :", err);
	res.status(500).json({ error: "Erreur interne du serveur" });
});

export default app;
