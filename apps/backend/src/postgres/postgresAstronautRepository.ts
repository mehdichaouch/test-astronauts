import { Client } from "pg";
import { AstronautRepository } from "@space/core/astronaut.spi.ts";
import { Astronaut, AstronautId, AstronautUpdates, NewAstronaut } from "@space/core/astronaut.model.ts";
import { v7 as uuidv7} from "uuid";
import { deserializeAstronauts } from "./serializers.js";
import { cleaningListResult, prepareUpdateAstronautSql } from "./utils.js";
import { AstronautAlreadyExist, AstronautNotFound } from "@space/core/astronaut.error.ts";

export class PostgresAstronautRepository implements AstronautRepository {

    constructor(private client: Client) {}

    listAstronauts(): Promise<ReadonlyArray<Astronaut>> {
        return this.client
        .query("Select id, firstname, lastname from astronauts")
        .then((result) => deserializeAstronauts(result.rows))
        .then(cleaningListResult)
    }

    addAstronaut(newAstronaut: NewAstronaut): Promise<AstronautId> {
        const id = uuidv7();
        const { firstname, lastname } = newAstronaut.value; 
        const params = [id, firstname.value, lastname.value];
        
        return this.client
            .query("INSERT INTO astronauts(id, firstname, lastname) VALUES ($1, $2, $3)", params)
            .then(
                () => id,
                (result) => {
                    if (result.message.includes("duplicate key")) {
                        throw new AstronautAlreadyExist();
                    }
                    throw result;
                })
    }

    updateAstronaut(astronautUpdates: AstronautUpdates): Promise<void> {
        const [sqlSet, values] = prepareUpdateAstronautSql(astronautUpdates);
        return this.client
            .query(`UPDATE astronauts SET ${sqlSet} WHERE id = $1`, values)
            .then((result) => {
                if(0 === result.rowCount) {
                    throw new AstronautNotFound();
                }
            })
    }

    deleteAstronaut(id: Astronaut["id"]): Promise<void> {
        return this.client
            .query("DELETE FROM astronauts WHERE id = $1", [id]).then();
    }
}
