/**
 * @author WMXPY
 * @namespace Express
 * @description Express
 */

import * as BodyParser from 'body-parser';
import * as Express from "express";
import { SudooExpressApplication } from "./application";
import { createAllowCrossOriginHandler, createHeaderHandler } from "./handlers";

export const createExpress = (app: SudooExpressApplication): Express.Express => {

    const express: Express.Express = Express();

    if (app.bodyParser) {

        express.use(BodyParser.json());
        express.use(BodyParser.urlencoded({
            extended: true,
        }));
    }

    express.use(createHeaderHandler(app));

    if (app.crossOrigin) {

        express.use(createAllowCrossOriginHandler(app));
    }

    return express;
};
