/**
 * @author WMXPY
 * @namespace Mock
 * @description Handler
 * @package Unit Test
 */

import { SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "../../src/declare";

export class MockHandler {

    public static create(): MockHandler {

        return new MockHandler();
    }

    private _req: SudooExpressRequest;
    private _res: SudooExpressResponse;
    private _next: SudooExpressNextFunction;

    private readonly _called: string[];

    private constructor() {

        this._req = {} as SudooExpressRequest;
        this._res = {} as SudooExpressResponse;
        this._next = () => this._called.push('NEXT');
    }

    public get req(): SudooExpressRequest {
        return this._req;
    }

    public get res(): SudooExpressResponse {
        return this._res;
    }

    public get next(): SudooExpressNextFunction {
        return this._next;
    }

    public request(partial: Partial<SudooExpressRequest>): MockHandler {

        this._req = {
            ...this._req,
            ...partial,
        } as SudooExpressRequest;
        return this;
    }

    public response(partial: Partial<SudooExpressResponse>): MockHandler {

        this._res = {
            ...this._res,
            ...partial,
        } as SudooExpressResponse;
        return this;
    }
}
