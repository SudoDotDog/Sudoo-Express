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
    private _crossOrigin: string | null;
    private _crossOriginAllowHeaders: string[];

    private constructor(appName: string, version: string) {

        this._appName = appName;
        this._version = version;

        this._bodyParser = true;
        this._crossOrigin = null;
        this._crossOriginAllowHeaders = [];
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

    public disableBodyParser(): SudooExpressApplication {

        this._bodyParser = false;
        return this;
    }

    public allowCrossOrigin(path?: string): SudooExpressApplication {

        this._crossOrigin = path
            ? path
            : '*';

        return this;
    }

    public setCrossOriginAllowHeaders(...headers: string[]): SudooExpressApplication {

        this._crossOriginAllowHeaders = headers;
        return this;
    }
}
