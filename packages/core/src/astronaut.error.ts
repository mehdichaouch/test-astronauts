export class AstronautNotFound extends Error {
    constructor() {
        super("Astronaut not found");
    }
}

export class AstronautAlreadyExist extends Error {
    constructor() {
        super("Astronaut already exists");
    }
}

export class AstronautInvalidValue extends Error {
    constructor(message: string, readonly errors?: ReadonlyArray<Error>){
        super(message)
    }
}

export class AstronautInternalError extends Error {
}