import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { AstronautFeatures } from "../astronaut.api";
import { makeAstronautFeatures } from "../astronaut.app";
import { Astronaut, AstronautUpdates, Firstname, Lastname, NewAstronaut } from "../astronaut.model";
import { AstronautRepository } from "../astronaut.spi";

import { inMemoryAstronautRepository } from "./inMemoryAstronaut.repository";
import { AstronautNotFound } from "../astronaut.error";

describe("astronaut", () => {
    const firstname = Firstname.from("Neil") as Firstname;
    const lastname = Lastname.from("Armstrong") as Lastname;
    const astronaut: Astronaut = new Astronaut("1", firstname, lastname);

    const newAstronaut: NewAstronaut = NewAstronaut.from({firstname: "Buzz", lastname: "Aldrin"}) as NewAstronaut;

    let repository: AstronautRepository;
    let features: AstronautFeatures;

    beforeEach(() => {
        repository = inMemoryAstronautRepository([astronaut]);
        features = makeAstronautFeatures(repository);
    })

    describe("listAstronauts", () => {
        it("should return a list of astronauts", async () => {
            const astronauts = await features.listAstronauts();
            expect(astronauts).toBeInstanceOf(Array);
            expect(astronauts).toHaveLength(1);
            expect(astronauts[0]).toEqual(astronaut);
        });
    });

    describe("addAstronaut", () => {
        it("should create an astronaut and return its id", async () => {
            const id = await features.addAstronaut(newAstronaut);
            expectTypeOf(id).toBeString();
        });
    });

    describe("updateAstronaut", () => {
        it("should update an astronaut's details", async () => {
            const astronautUpdates = AstronautUpdates.from({id: astronaut.id, firstname: 'lieN'}) as AstronautUpdates;
            
            await features.updateAstronaut(astronautUpdates);
            const astronauts = await features.listAstronauts();
            expect(astronauts).toHaveLength(1);
            const currentAstronaut = astronauts[0]!;

            expect(currentAstronaut.id).toStrictEqual(astronautUpdates.id);
            expect(currentAstronaut.firstname).toStrictEqual(astronautUpdates.value.firstname);
            expect(currentAstronaut.lastname).toStrictEqual(astronaut.lastname);
        });

        it("should throw an error if the astronaut does not exist", async () => {
            const astronautUpdates = AstronautUpdates.from({id: "42", firstname: astronaut.firstname}) as AstronautUpdates;
            // eslint-disable-next-line no-conditional-expect
            await expect(features.updateAstronaut(astronautUpdates)).rejects.toThrow(AstronautNotFound);
        });
    });

    describe("deleteAstronaut", () => {
        it("should delete an astronaut by id", async () => { 
            const spy = vi.spyOn(features, 'deleteAstronaut');
            await features.deleteAstronaut(astronaut.id);

            expect(spy).toHaveResolved();
            const data = await features.listAstronauts();
            expect(data).toHaveLength(0);
        });
    });
});