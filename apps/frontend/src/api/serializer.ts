import { AstronautInternalError } from "@space/core/astronaut.error.js";
import { Astronaut, AstronautUpdates, Firstname, Lastname } from "@space/core/astronaut.model.ts";

interface AstronautAPISchema {id: string, firstname: string, lastname: string}
export function deserializeAstronaut(data: AstronautAPISchema): Astronaut | Error {
    const firstname = Firstname.from(data.firstname);
    const lastname = Lastname.from(data.lastname);

    if(firstname instanceof Error || lastname instanceof Error){
        return new AstronautInternalError(`Invalid astronaut data : ${data}`);
    }

    return new Astronaut(data.id, firstname, lastname);
}

export function deserializeAstronauts(astronauts: readonly AstronautAPISchema[]): readonly (Astronaut|Error)[] {
    return astronauts.map(deserializeAstronaut);
}

export function serializeAstronautUpdatesValue(astronautUpdates: AstronautUpdates): object {
    return Object.entries(astronautUpdates.value)
    .reduce((result, [key, value]) => ({...result, [key] : value.value}), {})
} 