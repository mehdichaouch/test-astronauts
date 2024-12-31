import { Astronaut, AstronautUpdates } from "@space/core/astronaut.model.ts";

export function cleaningListResult(data: ReadonlyArray<Astronaut | Error>): ReadonlyArray<Astronaut> {
    const splitArray = (groups: [Astronaut[], Error[]], value: Astronaut | Error): [Astronaut[], Error[]] => {
        value instanceof Error 
        ? groups[1] = [...groups[1], value]
        : groups[0] = [...groups[0], value]
        return groups
    }
    const [astronauts, errors] = data.reduce(splitArray, [[], []]);

    if(errors.length > 0) {
        console.error(errors);
    }

    return astronauts;
}

export function prepareUpdateAstronautSql(astronautUpdates: AstronautUpdates): [string, string[]] {
    const id = astronautUpdates.id;
    return Object.entries(astronautUpdates.value)
        .reduce(([pSql, values], [key, val], index) => {
            const separator = 0 < index ? ',' : '';
            const position = index + 2;
            return [
                `${pSql}${separator}${key}=$${position}`, 
                [...values, val.value]
            ];
        }, ['', [id]] satisfies [string, unknown[]]);
}