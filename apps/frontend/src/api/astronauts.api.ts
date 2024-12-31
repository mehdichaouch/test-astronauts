import { AstronautRepository } from "@space/core/astronaut.spi.ts";
import { koResponseToError } from "./fetch";
import { Astronaut, AstronautId, AstronautUpdates, NewAstronaut } from "@space/core/astronaut.model.ts";
import { deserializeAstronauts, serializeAstronautUpdatesValue } from "./serializer";
import { cleaningListResult } from "./utils";


export class FetchAstronautApi implements AstronautRepository {
    constructor(private client: (path: string, init?: RequestInit) => Promise<Response>) {}
    
    listAstronauts(): Promise<ReadonlyArray<Astronaut>> {
        return this.client('astronauts')
        .then(koResponseToError)
        .then((response) => response.json())
        .then(deserializeAstronauts)
        .then(cleaningListResult);
    }

    addAstronaut(newAstronaut: NewAstronaut): Promise<AstronautId> {
        const data = {
            firstname: newAstronaut.value.firstname.value,
            lastname: newAstronaut.value.lastname.value,
        }
        return this.client(`astronauts`, {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(koResponseToError)
        .then((response) => {
            return response.json()
        });

    }
    updateAstronaut(astronautUpdates: AstronautUpdates): Promise<void> {
        const data = serializeAstronautUpdatesValue(astronautUpdates);
        return this.client(`astronauts/${astronautUpdates.id}`,
            {
                method: "PATCH",
                body: JSON.stringify(data)
            }
        )
        .then(koResponseToError)
        .then();
    }

    deleteAstronaut(id: Astronaut["id"]): Promise<void> {
        return this.client(`astronauts/${id}`, {
            method: "DELETE"
        })
        .then(koResponseToError)
        .then();
    }
}