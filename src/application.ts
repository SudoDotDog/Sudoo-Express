/**
 * @author WMXPY
 * @namespace Express
 * @description Application
 */

export class SudooExpressApplication {

    public static create(appName: string, version: string): SudooExpressApplication {

        return new SudooExpressApplication(appName, version);
    }

    private readonly _appName: string;
    private readonly _version: string;

    private _bodyParser: boolean;
    private _bodyParserLimit: string;

    private _cookieParser: boolean;
    private _cookieParserSecret: string | string[] | null;

    private _crossOrigin: string | null;
    private _crossOriginAllowHeaders: string[];

    private _allowDuplicateRoute: boolean;

    private _trustProxy: string | string[] | ((ip: string) => boolean) | boolean;

    private constructor(appName: string, version: string) {

        this._appName = appName;
        this._version = version;

        this._bodyParser = false;
        this._bodyParserLimit = '100kb';

        this._cookieParser = false;
        this._cookieParserSecret = null;

        this._crossOrigin = null;
        this._crossOriginAllowHeaders = [];

        this._allowDuplicateRoute = false;

        this._trustProxy = false;
    }

    public get appName(): string {
        return this._appName;
    }

    public get version(): string {
        return this._version;
    }

    public get crossOrigin(): string | null {
        return this._crossOrigin;
    }

    public get crossOriginAllowHeaders(): string[] {
        return this._crossOriginAllowHeaders;
    }

    public get bodyParser(): boolean {
        return this._bodyParser;
    }

    public get bodyParserLimit(): string {
        return this._bodyParserLimit;
    }

    public get cookieParser(): boolean {
        return this._cookieParser;
    }

    public get cookieParserSecret(): string | string[] | null {
        return this._cookieParserSecret;
    }

    public get allowDuplicateRoute(): boolean {
        return this._allowDuplicateRoute;
    }

    public get trustProxy(): string | string[] | ((ip: string) => boolean) | boolean {
        return this._trustProxy;
    }

    public setBodyParserLimit(limit: string): this {

        this._bodyParserLimit = limit;
        return this;
    }

    public useBodyParser(): this {
        this._bodyParser = true;
        return this;
    }

    public disableBodyParser(): this {
        this._bodyParser = false;
        return this;
    }

    public useCookieParser(): this {
        this._cookieParser = true;
        return this;
    }

    public useTrustProxy(value?: string | string[] | ((ip: string) => boolean) | boolean): this {
        if (typeof value === 'undefined') {
            this._trustProxy = true;
        } else {
            this._trustProxy = value;
        }
        return this;
    }

    public setCookieParserSecret(secret: string | string[]): this {
        this._cookieParserSecret = secret;
        return this;
    }

    public disableCookieParser(): this {
        this._cookieParser = false;
        return this;
    }

    public allowCrossOrigin(path?: string): this {

        this._crossOrigin = path
            ? path
            : '*';

        return this;
    }

    public setCrossOriginAllowHeaders(...headers: string[]): this {

        this._crossOriginAllowHeaders = headers;
        return this;
    }

    public enableAllowDuplicateRoute(): this {

        this._allowDuplicateRoute = true;
        return this;
    }

    public disableAllowDuplicateRoute(): this {

        this._allowDuplicateRoute = false;
        return this;
    }
}
