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
import { SudooExpressHandler, SudooExpressStaticOptions } from "./declare";
import { registerError, SUDOO_EXPRESS_ERROR_CODE } from "./error";
import { createExpress } from "./express";
import { createHealthCheckDirect, createResponseAgentHandler, createResponseSendHandler, createStaticHandler } from "./handlers";
import { ISudooExpressRoute, ROUTE_MODE, SudooExpressHandlerGroup } from "./route";

export class SudooExpress {

    public static create(app: SudooExpressApplication): SudooExpress {

        const error: Connor = registerError();
        return new SudooExpress(app, error.getErrorCreator());
    }

    private readonly _express: Express.Express;
    private readonly _http: Http.Server;
    private readonly _application: SudooExpressApplication;

    private readonly _errorCreator: ErrorCreationFunction;

    private readonly _groups: Map<string, SudooExpressHandler[]>;
    private readonly _handlers: Set<string>;

    private constructor(app: SudooExpressApplication, error: ErrorCreationFunction) {

        this._express = createExpress(app);
        this._http = Http.createServer(this._express);
        this._application = app;

        this._errorCreator = error;

        this._groups = new Map<string, SudooExpressHandler[]>();
        this._handlers = new Set<string>();
    }

    public get express(): Express.Express {
        return this._express;
    }
    public get http(): Http.Server {
        return this._http;
    }
    public get application(): SudooExpressApplication {
        return this._application;
    }

    public getRoutes(): string[] {

        return [...this._handlers.keys()];
    }

    public group(groupName: string, handlers: SudooExpressHandler[]): this {

        if (this._groups.has(groupName)) {

            throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.GROUP_ALREADY_EXIST, groupName);
        }

        this._groups.set(groupName, handlers);

        return this;
    }

    public host(port: number): this {

        this._http.listen(port);

        return this;
    }

    public use(handler: Express.Handler): this {

        this._express.use(handler);

        return this;
    }

    public static(path: string, options: SudooExpressStaticOptions = {}): this {

        this._express.use(createStaticHandler(path, options));
        return this;
    }

    public expressStatic(path: string, options?: ServeStatic.ServeStaticOptions, route?: string): this {

        if (route) {

            this._express.use(route, Express.static(path, options));
        } else {

            this._express.use(Express.static(path, options));
        }

        return this;
    }

    public health(
        path: string,
        isHealthyFunction: () => boolean = () => true,
        succeedResponse: any = {
            status: 'UP',
            version: this._application.version,
        },
        failedResponse: any = {
            status: 'DOWN',
            version: this._application.version,
        },
    ): this {

        this._express.get(path, createHealthCheckDirect(isHealthyFunction, succeedResponse, failedResponse));
        return this;
    }

    public routes(...routes: ISudooExpressRoute[]): this {

        return this.routeList(routes);
    }

    public routeList(routes: ISudooExpressRoute[]): this {

        routes.forEach((route: ISudooExpressRoute) => this.route(route));
        return this;
    }

    public route(route: ISudooExpressRoute): this {

        const parsedHandlerName: string = this._parseHandlerName(route.path, route.mode);
        if (this._handlers.has(parsedHandlerName)) {
            if (!this._application.allowDuplicateRoute) {
                throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.ROUTE_DUPLICATED, parsedHandlerName);
            }
        }

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

        this._handlers.add(parsedHandlerName);

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

    private _parseHandlerName(path: string, method: ROUTE_MODE): string {

        return `${method}^${path}`;
    }
}
