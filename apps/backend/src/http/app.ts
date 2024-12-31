import express, { Application, json as jsonMiddleware } from "express";
import corsMiddleware from "cors";
import { makeAstronautFeatures } from "@space/core/astronaut.app.ts";
import { AstronautRepository } from "@space/core/astronaut.spi.ts";
import { makeAstronautsController } from "./astronauts.controller.js";


export function makeApp(astronautRepository: AstronautRepository): Application {
    const astronautActions = makeAstronautFeatures(astronautRepository);
    const astronautRoutes = makeAstronautsController(express.Router(), astronautActions);

    const app = express();
    app.use(jsonMiddleware());
    app.use(corsMiddleware())
    app.use('/astronauts', astronautRoutes);
    return app;
};
