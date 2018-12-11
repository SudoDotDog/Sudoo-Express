/**
 * @author WMXPY
 * @namespace Express
 * @description Index
 */

import * as Express from "express";
import { SudooExpressApplication } from "./application";

export class SudooExpress {

    public static create(app: SudooExpressApplication): SudooExpress {

        return new SudooExpress(app);
    }

    private readonly _express: Express.Express;
    private readonly _application: SudooExpressApplication;

    private readonly _publicHandlers: Express.Handler[];

    private constructor(app: SudooExpressApplication) {

        this._express = Express();
        this._application = app;

        this._publicHandlers = this._initialize();
    }

    private _initialize(): Express.Handler[] {

        return [

        ];
    }
}
