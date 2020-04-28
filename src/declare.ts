/**
 * @author WMXPY
 * @namespace Express
 * @description Declare
 */

import { VerifyResult } from "@sudoo/verify";
import { Request, Response } from "express";
import { SudooExpressResponseAgent } from "./agent";

export type SudooExpressStaticOptions = {

    readonly excludes?: string[];
};

export type SudooExpressRequest<InstanceType extends any = any, PrincipalType extends any = any> = {

    authenticate: InstanceType;
    principal: PrincipalType;
    valid: boolean;

    queryVerify?: VerifyResult;
    paramsVerify?: VerifyResult;
    bodyVerify?: VerifyResult;

    readonly info: Record<string, any>;
} & Request;

export type SudooExpressResponse = {

    readonly agent: SudooExpressResponseAgent;
} & Response;

export type SudooExpressNextFunction = () => void;

export type SudooExpressHandler = (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => (void | Promise<void>);

export type SudooExpressErrorInfo = {

    readonly code: number;
    readonly message: string;
};

export type SudooExpressErrorHandler = (code: number, error: Error) => SudooExpressErrorInfo;
