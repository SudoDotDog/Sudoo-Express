/**
 * @author WMXPY
 * @namespace Express
 * @description Declare
 */

import { NextFunction, Request, Response } from "express";
import { SudooExpressResponseAgent } from './agent';

export enum SUDOO_EXPRESS_GROUP {

    HEADER = 'HEADER',
}

export type SudooExpressRequest = Request;
export type SudooExpressResponse = {
    agent: SudooExpressResponseAgent;
} & Response;
export type SudooExpressHandler = (req: SudooExpressRequest, res: SudooExpressResponse, next: NextFunction) => void;

export type SudooExpressErrorHandler = (code: number, error: Error) => {
    code: number;
    message: string;
};
