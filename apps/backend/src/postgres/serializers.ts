import { AstronautInternalError } from "@space/core/astronaut.error.js";
import { Astronaut, Firstname, Lastname } from "@space/core/astronaut.model.ts";

type AstronautSQLSchema = {id: string, firstname: string, lastname: string};
export function deserializeAstronaut(data: AstronautSQLSchema): Astronaut | Error {
    const firstname = Firstname.from(data.firstname);
    const lastname = Lastname.from(data.lastname);

    if(firstname instanceof Error || lastname instanceof Error){
        return new AstronautInternalError(`Invalid astronaut data : ${data}`);
    }

    return new Astronaut(data.id, firstname, lastname);
}

export function deserializeAstronauts(astronauts: ReadonlyArray<AstronautSQLSchema>): ReadonlyArray<Astronaut|Error> {
    return astronauts.map(deserializeAstronaut);
}

