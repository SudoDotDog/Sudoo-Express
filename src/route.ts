/**
 * @author WMXPY
 * @namespace Express
 * @description Route
 */

import { SudooExpressErrorHandler, SudooExpressHandler } from "./declare";

export enum ROUTE_MODE {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    ALL = 'ALL',
}

export type SudooExpressHandlerCreator = (...args: any[]) => SudooExpressHandler;

export type SudooExpressHandlerGroup = string | SudooExpressHandler;

export interface ISudooExpressRoute {

    readonly path: string;
    readonly mode: ROUTE_MODE;

    readonly groups: SudooExpressHandlerGroup[];
    readonly errorHandler: SudooExpressErrorHandler;
}
