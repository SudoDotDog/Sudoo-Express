/**
 * @author WMXPY
 * @namespace Express
 * @description Agent
 */

import { _Map } from "@sudoo/bark/map";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { Connor, ConnorError, ErrorCreationFunction } from "connor";
import { Response } from "express";
import { SudooExpressErrorHandler, SudooExpressNextFunction } from "./declare";
import { registerError, SUDOO_EXPRESS_ERROR_CODE } from "./error";
import { ISudooExpressRoute } from "./route";

export class SudooExpressResponseAgent {

    public static create(res: Response, route: ISudooExpressRoute): SudooExpressResponseAgent {

        const error: Connor = registerError();
        return new SudooExpressResponseAgent(res, route, error.getErrorCreator());
    }

    private readonly _res: Response;
    private readonly _route: ISudooExpressRoute;

    private readonly _errorCreator: ErrorCreationFunction;
    private readonly _successInfo: Map<string, any>;

    private _raw: any | null;
    private _file: string | null;
    private _redirect: string | null;
    private _binary: any | null;
    private _attachment: {
        readonly content: string;
        readonly filename: string;
        readonly type?: string;
    } | null;
    private _buffer: {
        readonly binary: any;
        readonly type: string;
    } | null;
    private _failInfo: {
        readonly code: number;
        readonly error: ConnorError;
    } | null;

    private _noContent: boolean;
    private _succeed: boolean;

    private constructor(res: Response, route: ISudooExpressRoute, errorCreator: ErrorCreationFunction) {

        this._res = res;
        this._route = route;

        this._errorCreator = errorCreator;
        this._successInfo = new Map<string, any>();

        this._raw = null;
        this._file = null;
        this._redirect = null;
        this._binary = null;
        this._attachment = null;
        this._buffer = null;
        this._failInfo = null;

        this._noContent = false;
        this._succeed = false;
    }

    public add(name: string, value: any): SudooExpressResponseAgent {

        this._expectOtherClean();
        this._successInfo.set(name, value);
        return this;
    }

    public migrate(map: Record<string, any>): SudooExpressResponseAgent {

        const keys: string[] = _Map.keys(map);

        for (const key of keys) {
            this.add(key, map[key]);
        }
        return this;
    }

    public addIfExist(name: string, value: any | undefined | null): SudooExpressResponseAgent {

        if (value === undefined || value === null) {
            return this;
        }
        return this.add(name, value);
    }

    public smart(path: string): SudooExpressResponseAgent {

        // tslint:disable-next-line: no-magic-numbers
        if (path.substring(0, 4) === 'http') {
            this.redirect(path);
        } else {
            this.addFile(path);
        }
        return this;
    }

    public redirect(path: string): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectAllClean();

        this._redirect = path;
        return this;
    }

    public attachment(content: string, filename: string, type?: string): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectAllClean();

        this._attachment = {
            content,
            filename,
            type,
        };
        return this;
    }

    public buffer(binary: any, type: string): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectAllClean();

        this._buffer = {
            binary,
            type,
        };
        return this;
    }

    public binary(binary: any): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectAllClean();

        this._binary = binary;
        return this;
    }

    public raw(content: any): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectAllClean();

        this._raw = content;
        return this;
    }

    public addFile(path: string): SudooExpressResponseAgent {

        this._checkFailed();
        this._expectAllClean();

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

            const errorHandler: SudooExpressErrorHandler = this._route.onError.bind(this._route);

            const { code, message } = errorHandler(this._failInfo.code, this._failInfo.error);
            this._res.status(code).send(message);
        } else if (this._raw) {

            this._res.status(HTTP_RESPONSE_CODE.OK).send(this._raw);
        } else if (this._file) {

            this._res.status(HTTP_RESPONSE_CODE.OK).sendFile(this._file);
        } else if (this._buffer) {

            this._res.contentType(this._buffer.type);
            this._res.status(HTTP_RESPONSE_CODE.OK).send(this._buffer);
        } else if (this._binary) {

            this._res.status(HTTP_RESPONSE_CODE.OK).end(this._binary, 'binary');
        } else if (this._attachment) {

            if (this._attachment.type) {
                this._res.type(this._attachment.type);
            }
            this._res.attachment(this._attachment.filename);
            this._res.send(this._attachment.content);
        } else if (this._redirect) {

            this._res.redirect(this._redirect);
        } else if (this._successInfo.size > 0) {

            const parsed: {
                [key: string]: any;
            } = {};
            this._successInfo.forEach((value: any, key: string) => {
                parsed[key] = value;
            });

            this._res.status(HTTP_RESPONSE_CODE.OK).send(parsed);
        } else {

            this._res.status(HTTP_RESPONSE_CODE.NO_CONTENT).send();
        }

        return this;
    }

    public isFailed(): boolean {

        if (this._failInfo) {

            return true;
        }
        return false;
    }

    public catchAndWrap(next: SudooExpressNextFunction): SudooExpressNextFunction {

        if (this.isFailed()) {

            this.send();
            return () => void 0;
        }

        return next;
    }

    private _expectAllClean(): void {

        this._expectClean(
            this._file,
            this._binary,
            this._successInfo.size > 0,
            this._redirect,
            this._buffer,
            this._raw,
            this._attachment,
            this._noContent,
            this._succeed,
        );
    }

    private _expectOtherClean(): void {

        this._expectClean(
            this._file,
            this._binary,
            this._redirect,
            this._buffer,
            this._raw,
            this._attachment,
            this._noContent,
            this._succeed,
        );
    }

    private _expectClean(...conditions: any[]): void {
        if (conditions.some(Boolean)) {
            throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.RESPONSE_NOT_CLEAN);
        }
    }

    private _checkFailed(): void {
        if (this._failInfo) {
            throw this._errorCreator(SUDOO_EXPRESS_ERROR_CODE.RESPONSE_ALREADY_FAILED, this._failInfo.toString());
        }
    }
}
