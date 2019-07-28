/**
 * @author WMXPY
 * @namespace Express
 * @description Base
 */

import { Connor, ErrorCreationFunction } from "connor";
import * as Express from "express";
import * as Http from "http";
import * as ServeStatic from "serve-static";
import { isString } from "util";
import { SudooExpressApplication } from "./application";
import { SudooExpressHandler } from "./declare";
import { registerError, SUDOO_EXPRESS_ERROR_CODE } from "./error";
import { createExpress } from "./express";
import { createHealthCheckDirect, createResponseAgentHandler, createResponseSendHandler } from "./handlers";
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

        this._express = createExpress(app);
        this._application = app;

        this._errorCreator = error;

        this._groups = new Map<string, SudooExpressHandler[]>();
    }

    public get express(): Express.Express {
        return this._express;
    }
    public get application(): SudooExpressApplication {
        return this._application;
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

    public static(path: string, options?: ServeStatic.ServeStaticOptions, route?: string): SudooExpress {

        if (route) {

            this._express.use(route, Express.static(path, options));
        } else {

            this._express.use(Express.static(path, options));
        }

        return this;
    }

    public health(path: string, response?: any): SudooExpress {

        this._express.get(path, createHealthCheckDirect(response));
        return this;
    }

    public routes(...routes: ISudooExpressRoute[]): SudooExpress {

        return this.routeList(routes);
    }

    public routeList(routes: ISudooExpressRoute[]): SudooExpress {

        routes.forEach((route: ISudooExpressRoute) => this.route(route));
        return this;
    }

    public route(route: ISudooExpressRoute): SudooExpress {

        const handlers: SudooExpressHandler[] = [

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
