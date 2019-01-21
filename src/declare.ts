/**
 * @author WMXPY
 * @namespace Express
 * @description Declare
 */

import { Request, Response } from "express";
import { SudooExpressResponseAgent } from './agent';

export enum SUDOO_EXPRESS_GROUP {

    HEADER = 'HEADER',
}

export type SudooExpressRequest = {
    authenticate: any | null;
    principal: any | null;
    valid: boolean;
    readonly info: Record<string, any>;
} & Request;
export type SudooExpressResponse = {
    readonly agent: SudooExpressResponseAgent;
} & Response;
export type SudooExpressNextFunction = () => void;
export type SudooExpressHandler = (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => void;

export type SudooExpressErrorHandler = (code: number, error: Error) => {
    code: number;
    message: string;
};
