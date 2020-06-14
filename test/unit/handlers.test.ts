/**
 * @author WMXPY
 * @namespace Express
 * @description Handlers
 * @package Unit Test
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { SudooExpressApplication } from '../../src/application';
import { createHeaderHandler } from '../../src/handlers';

describe('Given (Handlers) Express handler creator', (): void => {

    const chance: Chance.Chance = new Chance('sudoo-express-handlers');

    it('should be able to create header handler', (): void => {

        const appName: string = chance.string();
        const version: string = chance.string();
        const app: SudooExpressApplication = SudooExpressApplication.create(appName, version);

        const headHandler = createHeaderHandler(app);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(headHandler).to.be.exist;
    });
});
