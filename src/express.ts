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
    }

    if (app.bodyParser) {

        express.use(BodyParser.urlencoded({
            limit: app.bodyParserLimit,
            extended: true,
        }));
    }

    if (app.cookieParser) {

        if (app.cookieParserSecret) {
            express.use(CookieParser(app.cookieParserSecret));
        }
        express.use(CookieParser());
    }

    express.use(createHeaderHandler(app));

    if (app.crossOrigin) {

        express.use(createAllowCrossOriginHandler(app));
    }

    if (Boolean(app.trustProxy)) {

        express.set('trust proxy', app.trustProxy);
    }

    return express;
};
