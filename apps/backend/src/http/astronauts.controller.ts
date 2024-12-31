import {Request, Response, Router } from "express";
import { AstronautFeatures } from "@space/core/astronaut.api.ts";
import { AstronautUpdates, NewAstronaut } from "@space/core/astronaut.model.ts";
import { serializeAstronauts } from "./serializers.js";
import { AstronautNotFound, AstronautAlreadyExist, AstronautInvalidValue } from "@space/core/astronaut.error.js";

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
   
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    CONFLICT = 409,
   
    INTERNAL_SERVER_ERROR = 500
   }
   
export function makeAstronautsController(router: Router, features: AstronautFeatures): Router {
    router.get('/', (_req: Request, res: Response):void => {
        features.listAstronauts()
        .then((list) => serializeAstronauts(list))
        .then((data) => { res.json(data)});
    });

    router.post('/', (req: Request, res: Response):void => {
        const newAstronaut = NewAstronaut.from(req.body);
        
        checkParamsError(newAstronaut)
        .then(features.addAstronaut.bind(features))
        .then(
            (data) => { res.status(201).json({astronautId: data}) },
            (error) => handleError(error, res)
        )
    });

    router.patch('/:id', (req: Request, res: Response): void => {
        const { id } = req.params;
        const astronautUpdates = AstronautUpdates.from({...req.body, id});

        checkParamsError(astronautUpdates)
        .then(features.updateAstronaut.bind(astronautUpdates))
        .then(
            () => { res.sendStatus(HttpStatus.NO_CONTENT) },
            (error) => { handleError(error, res)}
        )
    });

    router.delete('/:id', (req: Request, res: Response): void => {
        const { id } = req.params;
        features.deleteAstronaut(id!)
        .then(() => {res.sendStatus(HttpStatus.NO_CONTENT)})
    })
    
    return router;
}

function handleError(error: Error | {code: HttpStatus, message: string}, res: Response): void {
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = error.message;
    let context;

    if(error instanceof AstronautNotFound) {
        code = HttpStatus.NOT_FOUND;
    } else if (error instanceof AstronautAlreadyExist) {
        code = HttpStatus.CONFLICT;
    } else if ( error instanceof AstronautInvalidValue) {
        context = error.errors
    } else if ('code' in error && 'message' in error) {
        code = error.code;
        message = error.message
    }

    const content = (context === undefined)
        ? { message }
        : { message, context };

    res.status(code).json(content);
}

export function checkParamsError<T>(data : T | Error): Promise<T> {
    return new Promise((resolve, reject) => {
        data instanceof Error
        ? reject({code: HttpStatus.BAD_REQUEST, message: data.message})
        : resolve(data);
    });
}