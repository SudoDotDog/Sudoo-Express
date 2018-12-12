/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { NextFunction } from "express";
import { SudooExpressResponseAgent } from "./agent";
import { SudooExpressApplication } from "./application";
import { SudooExpressErrorHandler, SudooExpressHandler, SudooExpressRequest, SudooExpressResponse } from "./declare";

export const createHeaderHandler = (app: SudooExpressApplication): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => {

        if (app.crossOrigin) {
            res.header("Access-Control-Allow-Origin", app.crossOrigin);
        }

        res.header("X-Powered-By", app.appName);
        res.header("X-Version", app.version);

        next();
    };

export const createResponseAgentHandler = (): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => {

        res.agent = SudooExpressResponseAgent.create(res);

        next();
    };

export const createResponseSendHandler = (errorHandleFunction: SudooExpressErrorHandler): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => {

        res.agent = SudooExpressResponseAgent.create(res);

        next();
    };
