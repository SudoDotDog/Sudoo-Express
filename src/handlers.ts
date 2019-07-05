/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { NextFunction, Request, RequestHandler, Response } from "express";
import { SudooExpressResponseAgent } from "./agent";
import { SudooExpressApplication } from "./application";
import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";
import { ISudooExpressRoute } from "./route";

export const createHealthCheckDirect = (response: any = {
    status: 'UP',
}): RequestHandler =>
    (_: Request, res: Response) => {

        res.status(200).send(response);
    };

export const createAllowCrossOriginHandler = (app: SudooExpressApplication): RequestHandler =>
    (_: Request, res: Response, next: NextFunction) => {

        if (!app.crossOrigin) {
            next();
            return;
        }

        res.header("Access-Control-Allow-Origin", app.crossOrigin);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            ...app.crossOriginAllowHeaders,
        ].join(", "));

        next();
    };

export const createHeaderHandler = (app: SudooExpressApplication): RequestHandler =>
    (_: Request, res: Response, next: NextFunction) => {

        res.header("X-Powered-By", app.appName);
        res.header("X-Version", app.version);

        next();
    };

export const createResponseAgentHandler = (route: ISudooExpressRoute): SudooExpressHandler =>
    (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        req.authenticate = null;
        req.principal = null;
        req.valid = false;
        (req as any).info = {};

        (res as any).agent = SudooExpressResponseAgent.create(res, route);

        next();
    };

export const createResponseSendHandler = (): SudooExpressHandler =>
    (_: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        res.agent.send();
        next();
    };
