/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 */

import { Handler, NextFunction, Request, Response } from "express";
import { SudooExpressApplication } from "./application";
import { SudooExpressHandlerCreator } from "./route";

export const createHeaderHandler = (app: SudooExpressApplication): Handler =>
    (req: Request, res: Response, next: NextFunction) => {

        if (app.crossOrigin) {
            res.header("Access-Control-Allow-Origin", app.crossOrigin);
        }

        res.header("X-Powered-By", app.appName);
        res.header("X-Version", app.version);

        next();
    };
