/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { pathExists } from "@sudoo/io";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as Path from "path";
import { SudooExpressResponseAgent } from "./agent";
import { SudooExpressApplication } from "./application";
import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse, SudooExpressStaticOptions, Writeable } from "./declare";
import { ISudooExpressRoute } from "./route";

export const createStaticHandler = (staticPath: string, option: SudooExpressStaticOptions): RequestHandler => {

    const excludes: string[] = option.excludes ?? [];
    return (req: Request, res: Response, next: NextFunction) => {

        if (excludes.includes(req.path)) {

            next();
            return;
        }

        const path: string = Path.join(staticPath, req.path);
        pathExists(path).then((value: boolean) => {

            if (value) {
                res.sendFile(path);
                return;
            }

            next();
        }).catch((reason: any) => {

            res.status(HTTP_RESPONSE_CODE.BAD_GATEWAY).send(reason);
            return;
        });
    };
};

export const createHealthCheckDirect = (
    isHealthyFunction: () => boolean,
    succeedResponse: any,
    failedResponse: any,
): RequestHandler => (_: Request, res: Response) => {

    const isHealthy: boolean = isHealthyFunction();

    if (isHealthy) {
        res.status(HTTP_RESPONSE_CODE.OK).send(succeedResponse);
    } else {
        res.status(HTTP_RESPONSE_CODE.SERVICE_UNAVAILABLE).send(failedResponse);
    }
};

export const createAllowCrossOriginHandler = (app: SudooExpressApplication): RequestHandler =>
    (_: Request, res: Response, next: NextFunction) => {

        if (!app.crossOrigin) {
            next();
            return;
        }

        res.header("Access-Control-Allow-Origin", app.crossOrigin);
        res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            ...app.crossOriginAllowHeaders,
        ].join(","));

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

        // Request
        req.authenticate = null;
        req.principal = null;
        req.valid = false;
        (req as Writeable<SudooExpressRequest>).infos = {};
        (req as Writeable<SudooExpressRequest>).extras = {};

        // Response
        (res as Writeable<SudooExpressResponse>).agent = SudooExpressResponseAgent.create(res, route);

        next();
    };

export const createResponseSendHandler = (): SudooExpressHandler =>
    (_: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

        res.agent.send();
        next();
    };
