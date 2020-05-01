/**
 * @author WMXPY
 * @namespace Express
 * @description Declare
 */

import { StringedResult, VerifyResult } from "@sudoo/verify";
import { Request, Response } from "express";
import { SudooExpressResponseAgent } from "./agent";

export type SudooExpressStaticOptions = {

    readonly excludes?: string[];
};

export type SudooExpressExtendRequest = {

    readonly accepted: any[];

    readonly ip: string;
    readonly ips: string[];

    readonly protocol: string;
    readonly secure: boolean;

    readonly subdomains: string[];
    readonly method: string;
    readonly path: string;
    readonly hostname: string;
    readonly host: string;
    readonly route: string;
    readonly originalUrl: string;
    readonly url: string;
    readonly baseUrl: string;

    readonly fresh: boolean;
    readonly stale: boolean;
    readonly xhr: boolean;

    readonly rawHeaders: string;
    readonly rawTailers: string;

    readonly headers: Record<string, any>;
    readonly trailers: Record<string, any>;
    readonly params: Record<string, any>;
    readonly cookies: Record<string, any>;
    readonly body: Record<string, any>;
    readonly query: Record<string, any>;
} & Request;

export type SudooExpressRequest<AuthenticateType extends any = any, PrincipalType extends any = any> = {

    authenticate: AuthenticateType;
    principal: PrincipalType;
    valid: boolean;

    queryVerify?: VerifyResult;
    paramsVerify?: VerifyResult;
    bodyVerify?: VerifyResult;

    stringedQueryVerify?: StringedResult;
    stringedParamsVerify?: StringedResult;
    stringedBodyVerify?: StringedResult;

    readonly info: Record<string, any>;
} & SudooExpressExtendRequest;

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
