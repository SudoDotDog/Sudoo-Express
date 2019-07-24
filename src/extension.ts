/**
 * @author WMXPY
 * @namespace Express
 * @description Extension
 */

import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";

export const createBearerAuthorizationTokenHandler = (): SudooExpressHandler => {

    return createAuthorizationTokenHandler('bearer');
};

export const createBasicAuthorizationTokenHandler = (): SudooExpressHandler => {

    return createAuthorizationTokenHandler('basic');
};

export const createAuthorizationTokenHandler = (protocol): SudooExpressHandler =>
    (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const authHeader: string | undefined = req.header('authorization') || req.header('Authorization');

        if (!authHeader) {
            req.principal = null;
            next();
            return;
        }

        if (!authHeader || authHeader.length <= 7) {
            req.principal = null;
            next();
            return;
        }

        const splited: string[] = authHeader.split(' ');
        if (splited.length !== 2) {
            req.principal = null;
            next();
            return;
        }

        const type: string = splited[0];

        if (type.toLowerCase() !== protocol) {
            req.principal = null;
            next();
            return;
        }

        const value: string = splited[1];

        req.principal = value;
        next();
        return;
    };
