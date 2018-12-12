/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { Handler, NextFunction } from "express";
import { SudooExpressResponseAgent } from "./agent";
import { SudooExpressApplication } from "./application";
import { SudooExpressErrorHandler, SudooExpressRequest, SudooExpressResponse } from "./declare";

export const createHeaderHandler = (app: SudooExpressApplication): Handler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => {

        if (app.crossOrigin) {
            res.header("Access-Control-Allow-Origin", app.crossOrigin);
        }

        res.header("X-Powered-By", app.appName);
        res.header("X-Version", app.version);

        next();
    };

export const createResponseAgentHandler = (): Handler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => {

        res.agent = SudooExpressResponseAgent.create(res);

        next();
    };

export const createResponseSendHandler = (errorHandleFunction: SudooExpressErrorHandler) =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => {

        res.agent = SudooExpressResponseAgent.create(res);

        next();
    };
