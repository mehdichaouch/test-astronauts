import { Astronaut, AstronautId, AstronautUpdates, NewAstronaut } from "../astronaut.model";
import { AstronautNotFound } from "../astronaut.error";
import { AstronautRepository } from "../astronaut.spi";


export function inMemoryAstronautRepository(astronauts: readonly Astronaut[]): AstronautRepository {
    const data = new Map<AstronautId, Astronaut>(astronauts.map((astronaut) => [astronaut.id, {...astronaut}]))

    return {
        listAstronauts: () => Promise.resolve([...data.values()]),
        
        addAstronaut: (newAstronaut: NewAstronaut) => new Promise((resolve) => {
            const id = crypto.randomUUID();
            data.set(id, {id, firstname: newAstronaut.value.firstname, lastname: newAstronaut.value.lastname});
            resolve(id)
        }),

        updateAstronaut: (astronautUpdates: AstronautUpdates) => new Promise((resolve, reject) => {
            if(!data.has(astronautUpdates.id)) {
                reject(new AstronautNotFound());
            }
            const id = astronautUpdates.id;
            const updates = astronautUpdates.value;

 
            data.set(id, {...data.get(id), ...updates, id} as Astronaut);
            resolve()
        }),

        deleteAstronaut: (id: Astronaut["id"]) => new Promise((resolve) => { 
            data.delete(id);
            resolve();
        })
    }
}