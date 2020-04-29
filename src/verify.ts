/**
 * @author WMXPY
 * @namespace Express
 * @description Verify
 */

import { Pattern, StringedResult, Verifier, VerifyResult } from "@sudoo/verify";
import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";

export const createQueryVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.query);
        req.queryVerify = result;

        next();
        return;
    };
};

export const createParamVerifyHandler = (pattern: Pattern): SudooExpressHandler => {

    const verifier: Verifier = Verifier.create(pattern);

    return (req: SudooExpressRequest, _: SudooExpressResponse, next: SudooExpressNextFunction) => {

        const result: VerifyResult = verifier.verify(req.params);
        req.paramsVerify = result;

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
