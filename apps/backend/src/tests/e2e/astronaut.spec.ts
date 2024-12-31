import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Application } from "express";
import { Client as DbClient } from 'pg';
import { validate as uuidValidate, v7 as uuidv7 } from 'uuid';
import { AstronautRepository } from "@space/core/astronaut.spi.ts";
import { PostgresAstronautRepository } from "../../postgres/postgresAstronautRepository.js";
import { makeApp } from "../../http/app.js";
import { Astronaut } from "@space/core/astronaut.model.ts";
import { HttpStatus } from "../../http/astronauts.controller.ts";

describe("Astronauts API", () => {
    const astronaut = { id: uuidv7(), firstname: "Neil", lastname: 'Armstrong' };
    let dbClient: DbClient
    let baseURL: string;
    let astronautRepository: AstronautRepository;
    let app: Application
    let server: ReturnType<typeof app.listen>;

    beforeAll(async () => {
        dbClient = new DbClient({
            connectionString: process.env["VITE_DATABASE_URL"],
        });
        await dbClient.connect()
        astronautRepository = new PostgresAstronautRepository(dbClient);
    })

    beforeEach(async () => {
        await dbClient.query(`
            INSERT INTO astronauts(id, firstname, lastname) 
            VALUES ($1, $2, $3) 
            ON CONFLICT(id) DO 
            UPDATE SET firstname = EXCLUDED.firstname, lastname = EXCLUDED.lastname`.trim(),
            [astronaut.id, astronaut.firstname, astronaut.lastname]
        );

        app = makeApp(astronautRepository);
        await new Promise<void>((resolve) => { server = app.listen(0, () => resolve())});
        const { port } = server.address();
        baseURL = `http://127.0.0.1:${port}/astronauts`;
    })

    afterEach(async () => {
        await dbClient.query('DELETE FROM astronauts');
        await new Promise<void>((resolve) => server.close(() => resolve()));
    })

    describe("GET /astronauts", () => {
        it('should return status OK on success', async () => {
            const response = await fetch(`${baseURL}`);
            expect(response.status).toBe(HttpStatus.OK)
        })

        it('should return correct content type header', async () => {
            const response = await fetch(baseURL);
            expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
        });

        it("should return a list of astronauts", async () => {
            const response = await fetch(`${baseURL}`);
            const astronauts = await response.json();
            expect(astronauts).toHaveLength(1);
            expect(astronauts[0]!.id).toStrictEqual(astronaut.id);
        });
    });

    describe("POST /astronauts", () => {
        it("should return BAD_REQUEST when firstname missing", async () => {
            const response = await fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lastname: "Aldrin" }),
            });
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return BAD_REQUEST when lastname missing", async () => {
            const response = await fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstname: "Buzz" }),
            });
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return BAD_REQUEST when firstname empty", async () => {
            const response = await fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstname: "", lastname: "Aldrin" }),
            });
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return BAD_REQUEST when lastname empty", async () => {
            const response = await fetch(baseURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstname: "Buzz", lastname: "" }),
            });
            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should return status CREATED on success', async () => {
            const response = await fetch(`${baseURL}/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname: "Buzz", lastname: "Aldrin" })
            });
            expect(response.status).toBe(HttpStatus.CREATED)
        })

        it('should return correct content type header', async () => {
            const response = await fetch(`${baseURL}/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname: "Buzz", lastname: "Aldrin" })
            }); expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
        });

        it("should return valid UUID on creation", async () => {
            const response = await fetch(`${baseURL}/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname: "Buzz", lastname: "Aldrin" })
            });
            const { astronautId } = await response.json();
            expect(uuidValidate(astronautId)).toBeTruthy();
        });
    });

    describe("PATCH /astronauts/:id", () => {
        it("should return NOT_FOUND for unknown astronaut", async () => {
            const response = await fetch(`${baseURL}/${uuidv7()}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstname: "Buzz" })
            });
            expect(response.status).toBe(HttpStatus.NOT_FOUND);
            const data = await response.json();
            expect(data).toMatchObject({ message: "Astronaut not found"});
        });

        it("should return BAD_REQUEST when no body provided", async () => {
            const response = await fetch(`${baseURL}/${astronaut.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it("should return NO_CONTENT on success", async () => {
            const response = await fetch(`${baseURL}/${astronaut.id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname: "Buzz", lastname: "Aldrin" })
            });

            expect(response.status).toBe(HttpStatus.NO_CONTENT);
        });

        it("should update astronaut data correctly", async () => {
            const updates = { firstname: "lieN" }
            await fetch(`${baseURL}/${astronaut.id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            const response = await fetch(`${baseURL}`);
            const astronauts = (await response.json()) as Astronaut[];

            expect(astronauts[0]).toEqual({
                ...astronaut,
                ...updates
            });
        });
    });

    describe("DELETE /astronauts/:id", () => {
        it("should return NO_CONTENT for unknown astronaut", async () => {
            const response = await fetch(`${baseURL}/${uuidv7()}`, {
                method: "DELETE",
            });

            expect(response.status).toBe(HttpStatus.NO_CONTENT);
        });

        it("should return NO_CONTENT on success", async () => {
            const response = await fetch(`${baseURL}/${astronaut.id}`, {
                method: "DELETE",
            });

            expect(response.status).toBe(HttpStatus.NO_CONTENT);
        });

        it("should remove astronaut", async () => {
            await fetch(`${baseURL}/${astronaut.id}`, {
                method: "DELETE",
            });

            const response = await fetch(`${baseURL}`)
            const data = await response.json();
            expect(data).toMatchObject([]);
        });
    });
});
