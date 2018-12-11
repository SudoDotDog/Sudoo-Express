/**
 * @author WMXPY
 * @namespace Express
 * @description Route
 */

export enum ROUTE_MODE {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PUT = 'PUT',
    ALL = 'ALL',
}

export interface ISudooExpressRoute {

    readonly name: string;
    readonly path: string;
    readonly mode: ROUTE_MODE;

    readonly groups: string[];
}
