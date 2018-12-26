/**
 * @author WMXPY
 * @namespace Express
 * @description Index
 */

import Connor, { ErrorCreationFunction } from "connor";
import * as Express from "express";
import * as Http from 'http';
import { isString } from "util";
import { SudooExpressApplication } from "./application";
import { SudooExpressHandler } from "./declare";
import { registerError, SUDOO_EXPRESS_ERROR_CODE } from "./error";
import { createHeaderHandler, createResponseAgentHandler, createResponseSendHandler } from "./handlers";
import { ISudooExpressRoute, ROUTE_MODE, SudooExpressHandlerGroup } from "./route";

export class SudooExpress {

    public static create(app: SudooExpressApplication): SudooExpress {

        const error: Connor = registerError();
        return new SudooExpress(app, error.getErrorCreator());
    }

    private readonly _express: Express.Express;
    private readonly _application: SudooExpressApplication;

    private readonly _errorCreator: ErrorCreationFunction;

    private readonly _groups: Map<string, SudooExpressHandler[]>;

    private constructor(app: SudooExpressApplication, error: ErrorCreationFunction) {

        this._express = Express();
        this._application = app;

        this._errorCreator = error;

        this._groups = new Map<string, SudooExpressHandler[]>();
    }

    public group(groupName: string, handlers: SudooExpressHandler[]): SudooExpress {

        if (this._groups.has(groupName)) {

            throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.GROUP_ALREADY_EXIST, groupName);
        }

        this._groups.set(groupName, handlers);

        return this;
    }

    public host(port: number): SudooExpress {

        const server: Http.Server = Http.createServer(this._express);
        server.listen(port);

        return this;
    }

    public use(handler: Express.Handler): SudooExpress {

        this._express.use(handler);

        return this;
    }

    public route(route: ISudooExpressRoute): SudooExpress {

        const handlers: SudooExpressHandler[] = [

            createHeaderHandler(this._application),
            createResponseAgentHandler(route),
        ].concat(route.groups.reduce((previous: SudooExpressHandler[], group: SudooExpressHandlerGroup) => {

            if (isString(group)) {

                return previous.concat(...this._assertGroup(group));
            }
            return previous.concat(group);
        }, [] as SudooExpressHandler[])).concat([

            createResponseSendHandler(),
        ]);

        switch (route.mode) {

            case ROUTE_MODE.ALL:
                this._express.all(route.path, ...handlers as any as Express.Handler[]);
                break;
            case ROUTE_MODE.DELETE:
                this._express.delete(route.path, ...handlers as any as Express.Handler[]);
                break;
            case ROUTE_MODE.GET:
                this._express.get(route.path, ...handlers as any as Express.Handler[]);
                break;
            case ROUTE_MODE.POST:
                this._express.post(route.path, ...handlers as any as Express.Handler[]);
                break;
            case ROUTE_MODE.PUT:
                this._express.put(route.path, ...handlers as any as Express.Handler[]);
                break;
            default:
                throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.ROUTE_MODE_NOT_EXIST, route.mode);
        }

        return this;
    }

    private _assertGroup(groupName: string): SudooExpressHandler[] {

        if (this._groups.has(groupName)) {

            return this._groups.get(groupName) as any as SudooExpressHandler[];
        }

        throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.GROUP_NOT_EXIST, groupName);
    }
}

export { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse, SUDOO_EXPRESS_GROUP } from './declare';
export { SudooExpressHook } from './hook';
export { SudooExpressApplication, ISudooExpressRoute, ROUTE_MODE, SudooExpressHandlerGroup };

