/**
 * @author WMXPY
 * @namespace Express
 * @description Hook
 */

import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from "./declare";

export class SudooExpressHook<T extends any[]> {

    public static create<T extends any[]>(): SudooExpressHook<T> {

        return new SudooExpressHook<T>();
    }

    private _beforeHook: null | ((...args: T) => boolean | Promise<boolean>);
    private _afterHook: null | ((...args: T) => void | Promise<void>);

    private _sync: boolean;

    private constructor() {

        this._beforeHook = null;
        this._afterHook = null;

        this._sync = false;
    }

    public before(func: (...args: T) => boolean | Promise<boolean>): SudooExpressHook<T> {

        this._beforeHook = func;
        return this;
    }

    public after(func: (...args: T) => void | Promise<void>): SudooExpressHook<T> {

        this._afterHook = func;
        return this;
    }

    public setSync(sync: boolean): SudooExpressHook<T> {

        this._sync = sync;
        return this;
    }

    public wrap(handler: SudooExpressHandler, ...args: T): SudooExpressHandler {

        const _this: this = this;

        return async (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {


            if (_this._beforeHook) {

                const isBeforeSucceed: boolean = await _this._beforeHook(...args);

                if (!isBeforeSucceed) {

                    next();
                    return;
                }
            }

            if (_this._afterHook) {

                const wrappedNext: () => (void | Promise<void>) = _this._sync ?
                    (() => {

                        this._afterHook(...args);
                        next();
                    }) : (async () => {

                        await _this._afterHook(...args);
                        next();
                    });

                handler(req, res, wrappedNext);
            } else {

                handler(req, res, next);
            }
        };
    }
}
