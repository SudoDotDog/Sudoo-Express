/**
 * @author WMXPY
 * @namespace Express
 * @description Agent
 */

import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import { Connor, ConnorError, ErrorCreationFunction } from "connor";
import { Response } from "express";
import { SudooExpressErrorHandler, SudooExpressErrorInfo, SudooExpressNextFunction } from "./declare";
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
    private _created: boolean;

    private _extras: Record<string, any>;

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
        this._created = false;

        this._extras = {};
    }

    public add(name: string, value: any): this {

        this._expectOtherClean();
        this._successInfo.set(name, value);
        return this;
    }

    public setExtra(name: string, value: any): this {

        this._extras[name] = value;
        return this;
    }

    public getExtra(name: string): any {

        return this._extras[name];
    }

    public replaceExtras(extras: Record<string, any>): this {

        this._extras = extras;
        return this;
    }

    public getExtras(): Record<string, any> {

        return this._extras;
    }

    public resetExtras(): this {

        this._extras = {};
        return this;
    }

    public migrate(map: Record<string, any>): this {

        const keys: string[] = Object.keys(map);

        for (const key of keys) {
            this.add(key, map[key]);
        }
        return this;
    }

    public addIfExist(name: string, value: any | undefined | null): this {

        if (value === undefined || value === null) {
            return this;
        }
        return this.add(name, value);
    }

    public smart(path: string): this {

        if (path.substring(0, 4) === 'http') {
            this.redirect(path);
        } else {
            this.addFile(path);
        }
        return this;
    }

    public redirect(path: string): this {

        this._checkFailed();
        this._expectAllClean();

        this._redirect = path;
        return this;
    }

    public attachment(content: string, filename: string, type?: string): this {

        this._checkFailed();
        this._expectAllClean();

        this._attachment = {
            content,
            filename,
            type,
        };
        return this;
    }

    public buffer(binary: any, type: string): this {

        this._checkFailed();
        this._expectAllClean();

        this._buffer = {
            binary,
            type,
        };
        return this;
    }

    public binary(binary: any): this {

        this._checkFailed();
        this._expectAllClean();

        this._binary = binary;
        return this;
    }

    public raw(content: any): this {

        this._checkFailed();
        this._expectAllClean();

        this._raw = content;
        return this;
    }

    public addFile(path: string): this {

        this._checkFailed();
        this._expectAllClean();

        this._file = path;
        return this;
    }

    public declareNoContent(): this {

        this._checkFailed();
        this._expectAllClean();

        this._noContent = true;
        return this;
    }

    public declareCreated(): this {

        this._checkFailed();
        this._expectAllClean();

        this._created = true;
        return this;
    }

    public fail(code: number, error: ConnorError): this {

        this._failInfo = {
            code,
            error,
        };
        return this;
    }

    public send(): this {

        if (this._failInfo) {

            const errorHandler: SudooExpressErrorHandler = this._route.onError.bind(this._route);
            const errorInfo: SudooExpressErrorInfo = errorHandler(this._failInfo.code, this._failInfo.error);

            this._res.status(errorInfo.code);
            if (errorInfo.response) {
                this._res.send(errorInfo.response);
            } else if (errorInfo.message) {
                this._res.send(errorInfo.message);
            } else {
                this._res.send(errorInfo.code);
            }
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
        } else if (this._created) {

            this._res.status(HTTP_RESPONSE_CODE.CREATED).send();
        } else if (this._noContent) {

            this._res.status(HTTP_RESPONSE_CODE.NO_CONTENT).send();
        } else {

            this._res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).send();
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
            this._created,
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
            this._created,
        );
    }

    private _expectClean(...conditions: any[]): void {
        if (conditions.some(Boolean)) {
            const errorCode: SUDOO_EXPRESS_ERROR_CODE = SUDOO_EXPRESS_ERROR_CODE.RESPONSE_NOT_CLEAN;
            throw this._errorCreator(errorCode);
        }
    }

    private _checkFailed(): void {
        if (this._failInfo) {
            const errorCode: SUDOO_EXPRESS_ERROR_CODE = SUDOO_EXPRESS_ERROR_CODE.RESPONSE_ALREADY_FAILED;
            throw this._errorCreator(errorCode, this._failInfo.toString());
        }
    }
}
