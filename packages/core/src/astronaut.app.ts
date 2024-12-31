import { AstronautFeatures } from "./astronaut.api.ts";
import { AstronautUpdates, NewAstronaut } from "./astronaut.model.ts";
import { AstronautRepository } from "./astronaut.spi.ts";

export function makeAstronautFeatures(repository: AstronautRepository): AstronautFeatures {
    return {
        listAstronauts: () => {
            return repository.listAstronauts();
        },

        addAstronaut: (newAstronaut: NewAstronaut) => {
            return repository.addAstronaut(newAstronaut);
        },

        updateAstronaut: (astronautUpdates: AstronautUpdates) => {
            return repository.updateAstronaut(astronautUpdates);
        },

        deleteAstronaut: (astronautId: string) => {
            return repository.deleteAstronaut(astronautId);
        }
    }
}
