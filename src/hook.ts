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

    private _beforeHook: null | ((req: SudooExpressRequest, res: SudooExpressResponse, ...args: T) => (boolean | Promise<boolean>));
    private _afterHook: null | ((req: SudooExpressRequest, res: SudooExpressResponse, ...args: T) => (void | Promise<void>));

    private constructor() {

        this._beforeHook = null;
        this._afterHook = null;
    }

    public before(func: (req: SudooExpressRequest, res: SudooExpressResponse, ...args: T) => (boolean | Promise<boolean>)): SudooExpressHook<T> {

        this._beforeHook = func;
        return this;
    }

    public after(func: (req: SudooExpressRequest, res: SudooExpressResponse, ...args: T) => (void | Promise<void>)): SudooExpressHook<T> {

        this._afterHook = func;
        return this;
    }

    public wrap(handler: SudooExpressHandler, ...args: T): SudooExpressHandler {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this: this = this;

        return async (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {

            if (_this._beforeHook) {

                // eslint-disable-next-line @typescript-eslint/no-shadow
                const beforeHook = _this._beforeHook as (req: SudooExpressRequest, res: SudooExpressResponse, ...args: T) => (boolean | Promise<boolean>);
                const isBeforeSucceed: boolean = await beforeHook(req, res, ...args);

                if (!isBeforeSucceed) {
                    next();
                    return;
                }
            }

            if (_this._afterHook) {

                // eslint-disable-next-line @typescript-eslint/no-shadow
                const afterHook = _this._afterHook as (req: SudooExpressRequest, res: SudooExpressResponse, ...args: T) => (void | Promise<void>);

                const wrappedNext: () => void | Promise<void> = async () => {
                    await afterHook(req, res, ...args);
                    next();
                };
                handler(req, res, wrappedNext);
            } else {
                handler(req, res, next);
            }
        };
    }
}
