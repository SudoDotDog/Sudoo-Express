/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { SudooExpressResponseAgent } from "./agent";
import { SudooExpressApplication } from "./application";
import { SudooExpressErrorHandler, SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";
import { ISudooExpressRoute } from "./route";

export const createHeaderHandler = (app: SudooExpressApplication): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        if (app.crossOrigin) {
            res.header("Access-Control-Allow-Origin", app.crossOrigin);
        }

        res.header("X-Powered-By", app.appName);
        res.header("X-Version", app.version);

        next();
    };

export const createResponseAgentHandler = (route: ISudooExpressRoute): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        req.authenticate = null;
        req.valid = false;
        (req as any).info = {};

        (res as any).agent = SudooExpressResponseAgent.create(res, route);

        next();
    };

export const createResponseSendHandler = (): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        res.agent.send();
        next();
    };
