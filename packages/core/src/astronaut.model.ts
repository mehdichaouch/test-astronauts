import { AstronautInvalidValue } from "./astronaut.error.ts";

export class Astronaut {
    constructor(readonly id: AstronautId, readonly firstname: Firstname, readonly lastname: Lastname) { }
}

export type AstronautId = string;

export class Firstname {
    private constructor(private readonly _value: string) { }

    static from(value: unknown): Firstname | Error {
        if (!isValidString(value)) {
            return new AstronautInvalidValue('Firstname must be a non-empty string')
        }
        return new Firstname(value);
    }

    get value() {
        return this._value;
    }
}

export class Lastname {
    private constructor(private readonly _value: string) { }

    static from(value: unknown): Lastname | Error {
        if (!isValidString(value)) {
            return new AstronautInvalidValue('Lastname must be a non-empty string')
        }
        return new Lastname(value);
    }

    get value() {
        return this._value;
    }
}

interface NewAstronautValue { firstname: Firstname, lastname: Lastname }
export class NewAstronaut {
    private constructor(readonly value: NewAstronautValue) { }
    
    static from(value: { [key: string]: unknown }): NewAstronaut | Error {
        const errors = [];
        const val = {} as NewAstronautValue;

        if (value['firstname'] === undefined) {
            errors.push(new AstronautInvalidValue("'firstname' is required"));
        } else {
            tryFrom(
                value['firstname'], 
                (v) => Firstname.from(v),
                (firstName) => (val.firstname = firstName),
                (error) => (errors.push(error)),
            );
        }

        if (value['lastname'] === undefined) {
            errors.push(new AstronautInvalidValue("'lastname' is required"));
        } else {
            tryFrom(
                value['lastname'], 
                (v) => Lastname.from(v),
                (lastName) => (val.lastname = lastName),
                (error) => (errors.push(error)),
            );
        }

        return 0 < errors.length
            ? new AstronautInvalidValue("Invalid astronaut data", errors)
            : new NewAstronaut(val);
    }
}


interface AstronautUpdatesValue { firstname?: Firstname, lastname?: Lastname }
export class AstronautUpdates {

    private constructor(readonly id: string, readonly value: AstronautUpdatesValue) { }

    static from(value: { id: string } & { [key: string]: unknown }): AstronautUpdates | Error {
        const errors = [];
        const val: AstronautUpdatesValue = {};

        if (!isValidString(value.id)) {
            errors.push(new AstronautInvalidValue('Astronaut id must be a non-empty string'));
        }

        if (value['firstname'] === undefined && value['lastname'] === undefined) {
            errors.push(new AstronautInvalidValue("At least one property 'firstname' or 'lastname' must be provided for update."));
        }

        tryFrom(
            value['firstname'], 
            (v) => Firstname.from(v),
            (firstName) => (val.firstname = firstName),
            (error) => (errors.push(error)),
        );

        tryFrom(
            value['lastname'], 
            (v) => Lastname.from(v),
            (lastName) => (val.lastname = lastName),
            (error) => (errors.push(error)),
        );

        return 0 < errors.length
            ? new AstronautInvalidValue("Invalid astronaut data", errors)
            : new AstronautUpdates(value.id, val);
    }
}


function isValidString(value: unknown): value is string {
    return 'string' === typeof value && 0 < value.length;
}

function tryFrom<T>(value: unknown, tryf: (value: unknown) => T | Error, ok: (value: T)=> void, ko: (error: Error) => void) {
    if(value === undefined) {
        return;
    }

    const result = tryf(value);
    if (result instanceof Error) {
        ko(result);
    } else {
        ok(result);
    }
}