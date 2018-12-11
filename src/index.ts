/**
 * @author WMXPY
 * @namespace Express
 * @description Index
 */

import * as Express from "express";
import * as Http from 'http';
import { SudooExpressApplication } from "./application";
import { createHeaderHandler } from "./handlers";

export class SudooExpress {

    public static create(app: SudooExpressApplication): SudooExpress {

        return new SudooExpress(app);
    }

    private readonly _express: Express.Express;
    private readonly _application: SudooExpressApplication;

    private readonly _staticHandlers: Express.Handler[];

    private constructor(app: SudooExpressApplication) {

        this._express = Express();
        this._application = app;

        this._staticHandlers = this._initialize();
    }

    public host(port: number) {

        const server: Http.Server = Http.createServer(this._express);
        server.listen(port);
    }

    private _initialize(): Express.Handler[] {

        return [
            createHeaderHandler(this._application),
        ];
    }
}
