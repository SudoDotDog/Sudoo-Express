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

export type SudooExpressRequest = Request;
export type SudooExpressResponse = {
    agent: SudooExpressResponseAgent;
} & Response;
export type SudooExpressErrorHandler = (code: number, error: Error) => {
    code: number;
    message: string;
};
