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

    private _crossOrigin: string | null;

    private constructor(appName: string, version: string) {

        this._appName = appName;
        this._version = version;

        this._crossOrigin = null;
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

    public allowCrossOrigin(path?: string): SudooExpressApplication {

        this._crossOrigin = path
            ? path
            : '*';

        return this;
    }
}
