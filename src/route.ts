/**
 * @author WMXPY
 * @namespace Express
 * @description Route
 */

import { ConnorError } from "connor";
import { Handler } from "express";

export enum ROUTE_MODE {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    ALL = 'ALL',
}

export type SudooExpressHandlerCreator = (...args: any[]) => Handler;

export type SudooExpressHandlerGroup = string | SudooExpressHandlerCreator;

export interface ISudooExpressRoute {

    readonly name: string;
    readonly path: string;
    readonly mode: ROUTE_MODE;

    readonly groups: SudooExpressHandlerGroup[];
    readonly errorHandler: (error: ConnorError) => Error;
}
