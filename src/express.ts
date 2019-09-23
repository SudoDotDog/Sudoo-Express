/**
 * @author WMXPY
 * @namespace Express
 * @description Express
 */

import * as BodyParser from 'body-parser';
import * as CookieParser from "cookie-parser";
import * as Express from "express";
import { SudooExpressApplication } from "./application";
import { createAllowCrossOriginHandler, createHeaderHandler } from "./handlers";

export const createExpress = (app: SudooExpressApplication): Express.Express => {

    const express: Express.Express = Express();

    if (app.bodyParser) {

        express.use(BodyParser.json({
            limit: app.bodyParserLimit,
        }));
        express.use(BodyParser.urlencoded({
            limit: app.bodyParserLimit,
            extended: true,
        }));
    }

    if (app.cookieParser) {

        express.use(CookieParser());
    }

    express.use(createHeaderHandler(app));

    if (app.crossOrigin) {

        express.use(createAllowCrossOriginHandler(app));
    }

    return express;
};
