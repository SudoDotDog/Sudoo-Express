/**
 * @author WMXPY
 * @namespace Express
 * @description Express
 */

import * as Express from "express";
import { SudooExpressApplication } from ".";
import { createAllowCrossOriginHandler } from "./handlers";

export const createExpress = (app: SudooExpressApplication): Express.Express => {

    const express = Express();

    if (app.crossOrigin) {

        express.use(createAllowCrossOriginHandler(app));
    }

    return express;
};
