import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../app/server";

async function createAdminToken() {
	const email = faker.internet.email().toLowerCase();
	const password = faker.internet.password({ length: 12 });
	const response = await request(app).post("/users").send({
		email,
		password
	});
	expect(response.status).toBe(201);
	const login = await request(app).post("/users/login").send({ email, password });
	expect(login.status).toBe(200);
	return login.body.token as string;
}

function buildMedicinePayload(overrides: Partial<Record<string, unknown>> = {}) {
	return {
		id: faker.string.uuid(),
		name: faker.commerce.productName(),
		category: faker.commerce.department(),
		price: Number.parseFloat(faker.commerce.price({ min: 1, max: 50 })),
		stock: faker.number.int({ min: 1, max: 100 }),
		expirationDate: faker.date.future().toISOString(),
		description: faker.commerce.productDescription(),
		...overrides
	};
}

describe("API Pharmacie", () => {
	test("refuse l'accès sans authentification", async () => {
		const response = await request(app).get("/pharmacie/medicaments");
		expect(response.status).toBe(401);
	});

	test("création et récupération d'un médicament", async () => {
		const token = await createAdminToken();
		const payload = buildMedicinePayload();

		const createResponse = await request(app)
			.post("/pharmacie/medicaments")
			.set("Authorization", `Bearer ${token}`)
			.send(payload);
		expect(createResponse.status).toBe(201);
		expect(createResponse.body.id).toBe(payload.id);

		const listResponse = await request(app)
			.get("/pharmacie/medicaments")
			.set("Authorization", `Bearer ${token}`);
		expect(listResponse.status).toBe(200);
		expect(Array.isArray(listResponse.body)).toBe(true);
		expect(listResponse.body.find((item: { id: string }) => item.id === payload.id)).toBeDefined();
	});

	test("mise à jour d'un médicament", async () => {
		const token = await createAdminToken();
		const payload = buildMedicinePayload();

		await request(app)
			.post("/pharmacie/medicaments")
			.set("Authorization", `Bearer ${token}`)
			.send(payload)
			.expect(201);

		const updatedResponse = await request(app)
			.put(`/pharmacie/medicaments/${payload.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ ...payload, stock: 5 });
		expect(updatedResponse.status).toBe(200);
		expect(updatedResponse.body.stock).toBe(5);
	});

	test("suppression d'un médicament", async () => {
		const token = await createAdminToken();
		const payload = buildMedicinePayload();

		await request(app)
			.post("/pharmacie/medicaments")
			.set("Authorization", `Bearer ${token}`)
			.send(payload)
			.expect(201);

		const deleteResponse = await request(app)
			.delete(`/pharmacie/medicaments/${payload.id}`)
			.set("Authorization", `Bearer ${token}`);
		expect(deleteResponse.status).toBe(204);

		const getResponse = await request(app)
			.get(`/pharmacie/medicaments/${payload.id}`)
			.set("Authorization", `Bearer ${token}`);
		expect(getResponse.status).toBe(404);
	});

	test("refuse la création avec un prix négatif", async () => {
		const token = await createAdminToken();
		const payload = buildMedicinePayload({ price: -10 });

		const response = await request(app)
			.post("/pharmacie/medicaments")
			.set("Authorization", `Bearer ${token}`)
			.send(payload);
		expect(response.status).toBe(400);
	});
});

