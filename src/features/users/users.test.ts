import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../app/server";

describe("API Utilisateurs", () => {
	test("mot de passe trop court", async () => {
		let response = await request(app).post("/users").send({
			email: "test@test.com",
			password: "123456"
		});
		expect(response.status).toBe(400);

		response = await request(app).post("/users").send({
			email: "test@test.com",
			password: "1234567"
		});
		expect(response.status).toBe(400);
	});

	test("email invalide 01", async () => {
		const response = await request(app).post("/users").send({
			email: "caleb01",
			password: "12345678"
		});
		expect(response.status).toBe(400);
	});

	test("email invalide 02", async () => {
		const response = await request(app).post("/users").send({
			email: "ashad02",
			password: "12345678"
		});
		expect(response.status).toBe(400);
	});

	test("create a valid user", async () => {
		const email = faker.internet.email().toLowerCase();
		const password = faker.internet.password({ length: 12 });
		const response = await request(app).post("/users").send({
			email,
			password
		});
		expect(response.status).toBe(201);
		expect(response.body.email).toBe(email);
		expect(response.body.password).toBeDefined();
		expect(response.body.password).not.toBe(password);
		expect(response.body.role).toBeNull();
		expect(typeof response.body.createdAt).toBe("string");

		const response2 = await request(app).post("/users").send({
			email,
			password
		});
		expect(response2.status).toBe(409);
	});

	test("authentification - cas nominal - happy path", async () => {
		const email = faker.internet.email().toLowerCase();
		const password = faker.internet.password({ length: 12 });

		let response = await request(app).post("/users").send({
			email,
			password
		});
		expect(response.status).toBe(201);

		response = await request(app).post("/users/login").send({
			email,
			password
		});
		expect(response.status).toBe(200);
		expect(response.body.token).toBeDefined();
	});

	test("authentification - invalid credentials", async () => {
		const email = faker.internet.email().toLowerCase();
		const password = faker.internet.password({ length: 12 });

		let response = await request(app).post("/users").send({
			email,
			password
		});
		expect(response.status).toBe(201);

		response = await request(app).post("/users/login").send({
			email,
			password: "45373"
		});
		expect(response.status).toBe(401);

		response = await request(app).post("/users/login").send({
			email: faker.internet.email().toLowerCase(),
			password
		});
		expect(response.status).toBe(401);
	});

	test("suppression d'un utilisateur sans authentification", async () => {
		const response = await request(app).delete("/users/12345678");
		expect(response.status).toBe(401);
	});

	test("suppression d'un utilisateur non autorisé", async () => {
		const email1 = faker.internet.email().toLowerCase();
		const password1 = faker.internet.password({ length: 12 });

		const user1 = await request(app).post("/users").send({
			email: email1,
			password: password1
		});
		expect(user1.status).toBe(201);
		const user1Id = user1.body.id as string;

		const user1Login = await request(app).post("/users/login").send({
			email: email1,
			password: password1
		});
		expect(user1Login.status).toBe(200);
		const jwtToken = user1Login.body.token as string;

		const response = await request(app)
			.delete(`/users/${user1Id}-autre`)
			.set("Authorization", `Bearer ${jwtToken}`);
		expect(response.status).toBe(401);
	});

	test("suppression d'un utilisateur par lui-même", async () => {
		const email = faker.internet.email().toLowerCase();
		const password = faker.internet.password({ length: 12 });

		const create = await request(app).post("/users").send({
			email,
			password
		});
		expect(create.status).toBe(201);
		const userId = create.body.id as string;

		const login = await request(app).post("/users/login").send({
			email,
			password
		});
		expect(login.status).toBe(200);
		const token = login.body.token as string;

		const response = await request(app)
			.delete(`/users/${userId}`)
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(204);
	});
});

