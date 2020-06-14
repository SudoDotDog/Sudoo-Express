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

    get(name: "set-cookie"): string[] | undefined;
    get(name: string): string | undefined;

    header(name: "set-cookie"): string[] | undefined;
    header(name: string): string | undefined;

    param(name: string, defaultValue?: any): string;
} & Request;

export type SudooExpressRequest<AuthenticateType extends any = any, PrincipalType extends any = any> = {

    authenticate: AuthenticateType;
    principal: PrincipalType;
    valid: boolean;

    headersVerify?: VerifyResult;
    trailersVerify?: VerifyResult;
    queryVerify?: VerifyResult;
    paramsVerify?: VerifyResult;
    cookiesVerify?: VerifyResult;
    bodyVerify?: VerifyResult;

    stringedHeadersVerify?: StringedResult;
    stringedTrailersVerify?: StringedResult;
    stringedQueryVerify?: StringedResult;
    stringedParamsVerify?: StringedResult;
    stringedCookiesVerify?: StringedResult;
    stringedBodyVerify?: StringedResult;

    readonly info: Record<string, any>;
} & SudooExpressExtendRequest;

export type SudooExpressResponse = {

    readonly agent: SudooExpressResponseAgent;
} & Response;

export type SudooExpressNextFunction = () => any | Promise<any>;

export type SudooExpressHandler = (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => void | Promise<void>;

export type SudooExpressErrorInfo = {

    readonly code: number;
    readonly message?: string;
    readonly response?: any;
};

export type SudooExpressErrorHandler = (code: number, error: Error) => SudooExpressErrorInfo;
