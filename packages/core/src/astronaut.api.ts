import { Astronaut, AstronautUpdates, NewAstronaut } from "./astronaut.model.ts"

type ListAstronauts = () => Promise<ReadonlyArray<Astronaut>>;

type AddAstronaut = (newAstronaut: NewAstronaut) => Promise<Astronaut["id"]>;

type UpdateAstronaut = (astronautUpdates: AstronautUpdates) => Promise<void>;

type DeleteAstronaut = (astronautId: Astronaut["id"]) => Promise<void>;

export interface AstronautFeatures {
    listAstronauts: ListAstronauts;
    addAstronaut: AddAstronaut;
    updateAstronaut: UpdateAstronaut;
    deleteAstronaut: DeleteAstronaut;
}