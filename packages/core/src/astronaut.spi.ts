import { Astronaut, AstronautId, AstronautUpdates, NewAstronaut } from "./astronaut.model.ts";

export interface AstronautRepository {
  listAstronauts(): Promise<ReadonlyArray<Astronaut>>;
  addAstronaut(newAstronaut: NewAstronaut): Promise<AstronautId>;
  updateAstronaut(astronautUpdates: AstronautUpdates): Promise<void>
  deleteAstronaut(astronautId: Astronaut["id"]): Promise<void>
}