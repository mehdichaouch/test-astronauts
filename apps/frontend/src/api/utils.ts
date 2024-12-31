import { Astronaut } from "@space/core/astronaut.model.ts";

export function cleaningListResult(data: readonly (Astronaut | Error)[]): readonly Astronaut[] {
    const splitArray = (groups: [Astronaut[], Error[]], value: Astronaut | Error): [Astronaut[], Error[]] => {
        value instanceof Error 
        ? groups[1] = [...groups[1], value]
        : groups[0] = [...groups[0], value]
        return groups
    }
    const [astronauts, errors] = data.reduce(splitArray, [[], []]);

    if(0 < errors.length) {
        console.error(errors);
    }

    return astronauts;
}