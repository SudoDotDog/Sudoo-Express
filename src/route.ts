/**
 * @author WMXPY
 * @namespace Express
 * @description Route
 */

import { Handler } from "express";
import { SudooExpressErrorHandler } from "./declare";

export enum ROUTE_MODE {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    ALL = 'ALL',
}

export type SudooExpressHandlerCreator = (...args: any[]) => Handler;

export type SudooExpressHandlerGroup = string | Handler;

export interface ISudooExpressRoute {

    readonly path: string;
    readonly mode: ROUTE_MODE;

    readonly groups: SudooExpressHandlerGroup[];
    readonly errorHandler: SudooExpressErrorHandler;
}
