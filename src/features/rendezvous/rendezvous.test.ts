import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../app/server";

async function registerUser() {
	const email = faker.internet.email().toLowerCase();
	const password = faker.internet.password({ length: 12 });
	const response = await request(app).post("/users").send({
		email,
		password
	});
	expect(response.status).toBe(201);
	const login = await request(app).post("/users/login").send({ email, password });
	expect(login.status).toBe(200);
	return {
		token: login.body.token as string,
		id: response.body.id as string,
		email,
		password
	};
}

function buildRendezVousPayload(overrides: Partial<Record<string, unknown>> = {}) {
	return {
		id: faker.string.uuid(),
		idPatient: faker.string.uuid(),
		idMedecin: faker.string.uuid(),
		date: faker.date.future().toISOString(),
		heure: "09:00",
		motif: "Consultation",
		statut: "en_attente",
		...overrides
	};
}

describe("API RendezVous", () => {
	test("refuse la création sans authentification", async () => {
		const payload = buildRendezVousPayload();
		const response = await request(app).post("/rendezvous").send(payload);
		expect(response.status).toBe(401);
	});

	test("création et lecture d'un rendez-vous", async () => {
		const admin = await registerUser();
		const patient = await registerUser();
		const medecin = await registerUser();
		const payload = buildRendezVousPayload({ idPatient: patient.id, idMedecin: medecin.id });

		const createResponse = await request(app)
			.post("/rendezvous")
			.set("Authorization", `Bearer ${admin.token}`)
			.send(payload);
		expect(createResponse.status).toBe(201);

		const getResponse = await request(app)
			.get(`/rendezvous/${payload.id}`)
			.set("Authorization", `Bearer ${patient.token}`);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body.id).toBe(payload.id);
	});

	test("liste les rendez-vous d'un patient", async () => {
		const admin = await registerUser();
		const patient = await registerUser();
		const medecin = await registerUser();
		const payload = buildRendezVousPayload({ idPatient: patient.id, idMedecin: medecin.id });

		await request(app)
			.post("/rendezvous")
			.set("Authorization", `Bearer ${admin.token}`)
			.send(payload)
			.expect(201);

		const listResponse = await request(app)
			.get(`/rendezvous/patients/${patient.id}`)
			.set("Authorization", `Bearer ${patient.token}`);
		expect(listResponse.status).toBe(200);
		expect(Array.isArray(listResponse.body)).toBe(true);
		expect(listResponse.body.find((rdv: { id: string }) => rdv.id === payload.id)).toBeDefined();
	});

	test("mise à jour du statut par un médecin", async () => {
		const admin = await registerUser();
		const patient = await registerUser();
		const medecin = await registerUser();
		const payload = buildRendezVousPayload({ idPatient: patient.id, idMedecin: medecin.id });

		await request(app)
			.post("/rendezvous")
			.set("Authorization", `Bearer ${admin.token}`)
			.send(payload)
			.expect(201);

		const updateResponse = await request(app)
			.patch(`/rendezvous/${payload.id}/statut`)
			.set("Authorization", `Bearer ${medecin.token}`)
			.send({ statut: "confirme" });
		expect(updateResponse.status).toBe(200);
		expect(updateResponse.body.statut).toBe("confirme");
	});

	test("suppression d'un rendez-vous par un administrateur", async () => {
		const admin = await registerUser();
		const patient = await registerUser();
		const medecin = await registerUser();
		const payload = buildRendezVousPayload({ idPatient: patient.id, idMedecin: medecin.id });

		await request(app)
			.post("/rendezvous")
			.set("Authorization", `Bearer ${admin.token}`)
			.send(payload)
			.expect(201);

	const deleteResponse = await request(app)
		.delete(`/rendezvous/${payload.id}`)
		.set("Authorization", `Bearer ${admin.token}`);
	expect(deleteResponse.status).toBe(204);

	const getResponse = await request(app)
		.get(`/rendezvous/${payload.id}`)
		.set("Authorization", `Bearer ${admin.token}`);
	expect(getResponse.status).toBe(404);
	});
});

