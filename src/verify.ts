/**
 * @author WMXPY
 * @namespace Express
 * @description Verify
 */

import { Pattern, StringedResult, Verifier, VerifyResult } from "@sudoo/verify";
import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";

export const createHeadersVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.headers);
        req.headersVerify = result;

        next();
        return;
    };
};

export const createTrailersVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.trailers);
        req.trailersVerify = result;

        next();
        return;
    };
};

export const createQueryVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.query);
        req.queryVerify = result;

        next();
        return;
    };
};

export const createParamsVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.params);
        req.paramsVerify = result;

        next();
        return;
    };
};

export const createCookiesVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.cookies);
        req.cookiesVerify = result;

        next();
        return;
    };
};

export const createBodyVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.body);
        req.bodyVerify = result;

        next();
        return;
    };
};

export const createStringedQueryVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: StringedResult = verifier.conclude(req.query);
        req.stringedQueryVerify = result;

        next();
        return;
    };
};

export const createStringedParamVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: StringedResult = verifier.conclude(req.params);
        req.stringedParamsVerify = result;

        next();
        return;
    };
};

export const createStringedBodyVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: StringedResult = verifier.conclude(req.body);
        req.stringedBodyVerify = result;

        next();
        return;
    };
};
