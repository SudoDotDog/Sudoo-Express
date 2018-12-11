/**
 * @author WMXPY
 * @namespace Mock
 * @description Handler
 * @package Unit Test
 */

import { NextFunction, Request, Response } from "express";

export class MockHandler {

    public static create(): MockHandler {

        return new MockHandler();
    }

    private _req: Request;
    private _res: Response;
    private _next: NextFunction;

    private readonly _called: string[];

    private constructor() {

        this._req = {} as Request;
        this._res = {} as Response;
        this._next = () => this._called.push('NEXT');
    }

    public get req(): Request {
        return this._req;
    }

    public get res(): Response {
        return this._res;
    }

    public get next(): NextFunction {
        return this._next;
    }

    public request(partial: Partial<Request>): MockHandler {

        this._req = {
            ...this._req,
            ...partial,
        } as Request;
        return this;
    }

    public response(partial: Partial<Response>): MockHandler {

        this._res = {
            ...this._res,
            ...partial,
        } as Response;
        return this;
    }
}
