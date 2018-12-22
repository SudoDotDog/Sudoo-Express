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
} & Request;
export type SudooExpressResponse = {
    agent: SudooExpressResponseAgent;
} & Response;
export type SudooExpressNextFunction = () => void;
export type SudooExpressHandler = (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => void;

export type SudooExpressErrorHandler = (code: number, error: Error) => {
    code: number;
    message: string;
};
