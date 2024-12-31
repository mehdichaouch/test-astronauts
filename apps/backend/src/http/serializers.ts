import { Astronaut } from "@space/core/astronaut.model.ts";

export function serializeAstronaut(astronaut: Astronaut): object {
    const { id, firstname, lastname } = astronaut;

    return {
        id: id,
        firstname: firstname.value,
        lastname: lastname.value
    }
}

export function serializeAstronauts(astronauts: ReadonlyArray<Astronaut>): object[] {
    return astronauts.map(serializeAstronaut);
}