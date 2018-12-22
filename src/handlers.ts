/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { SudooExpressResponseAgent } from "./agent";
import { SudooExpressApplication } from "./application";
import { SudooExpressErrorHandler, SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";

export const createHeaderHandler = (app: SudooExpressApplication): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        if (app.crossOrigin) {
            res.header("Access-Control-Allow-Origin", app.crossOrigin);
        }

        res.header("X-Powered-By", app.appName);
        res.header("X-Version", app.version);

        next();
    };

export const createResponseAgentHandler = (errorHandleFunction: SudooExpressErrorHandler): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        res.agent = SudooExpressResponseAgent.create(res, errorHandleFunction);

        next();
    };

export const createResponseSendHandler = (errorHandleFunction: SudooExpressErrorHandler): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        res.agent.send(errorHandleFunction);
        next();
    };
