/**
 * @author WMXPY
 * @namespace Express
 * @description Agent
 */

import Connor, { ConnorError, ErrorCreationFunction } from 'connor';
import { Response } from "express";
import { registerError, SUDOO_EXPRESS_ERROR_CODE } from './error';

export class SudooExpressResponseAgent {

    public static create(res: Response): SudooExpressResponseAgent {

        const error: Connor = registerError();
        return new SudooExpressResponseAgent(res, error.getErrorCreator());
    }

    private readonly _res: Response;
    private readonly _errorCreator: ErrorCreationFunction;

    private _file: string | null;
    private _redirect: string | null;

    private _failInfo: {
        code: number;
        error: ConnorError;
    } | null;
    private _successInfo: Map<string, any>;

    private constructor(res: Response, errorCreator: ErrorCreationFunction) {

        this._res = res;
        this._errorCreator = errorCreator;

        this._file = null;
        this._redirect = null;

        this._failInfo = null;
        this._successInfo = new Map<string, any>();
    }

    public add(name: string, value: any): SudooExpressResponseAgent {

        this._expectClean(this._file, this._redirect);
        this._successInfo.set(name, value);
        return this;
    }

    public smart(path: string): SudooExpressResponseAgent {

        if (path.substring(0, 4) === 'http') {
            this.redirect(path);
        } else {
            this.addFile(path);
        }
        return this;
    }

    public redirect(path: string): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectClean(this._file, this._successInfo.size > 0, this._redirect);

        this._redirect = path;
        return this;
    }

    public addFile(path: string): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectClean(this._file, this._successInfo.size > 0, this._redirect);

        this._file = path;
        return this;
    }

    public fail(code: number, error: ConnorError): SudooExpressResponseAgent {

        this._failInfo = {
            code,
            error,
        };
        return this;
    }

    public send(): SudooExpressResponseAgent {

        if (this._failInfo) {

            this._res.status(this._failInfo.code).send(this._failInfo.error);
        } else if (this._file) {

            this._res.status(200).sendFile(this._file);
        } else if (this._redirect) {

            this._res.redirect(this._redirect);
        } else if (this._successInfo.size > 0) {

            const parsed: {
                [key: string]: any;
            } = {};
            this._successInfo.forEach((value: any, key: string) => {
                parsed[key] = value;
            });

            this._res.status(200).send(parsed);
        } else {

            this._res.status(204).send();
        }

        return this;
    }

    private _expectClean(...conditions: any[]) {
        if (conditions.some(Boolean)) {
            throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.RESPONSE_NOT_CLEAN);
        }
    }

    private _checkFailed() {
        if (this._failInfo) {
            throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.RESPONSE_ALREADY_FAILED, this._failInfo.toString());
        }
    }
}
