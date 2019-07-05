/**
 * @author WMXPY
 * @namespace Express
 * @description Declare
 */

import { Request, Response } from "express";
import { SudooExpressResponseAgent } from "./agent";

export type SudooExpressRequest = {
    authenticate: any;
    principal: any;
    valid: boolean;
    readonly info: Record<string, any>;
} & Request;

export type SudooExpressResponse = {
    readonly agent: SudooExpressResponseAgent;
} & Response;

export type SudooExpressNextFunction = () => void;

export type SudooExpressHandler = (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => void;

export type SudooExpressErrorInfo = {
    readonly code: number;
    readonly message: string;
};

export type SudooExpressErrorHandler = (code: number, error: Error) => SudooExpressErrorInfo;
