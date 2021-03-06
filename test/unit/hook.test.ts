/**
 * @author WMXPY
 * @namespace Express
 * @description Hook
 * @package Unit Test
 */

import { expect } from 'chai';
import * as Chance from 'chance';
import { SudooExpressHandler, SudooExpressNextFunction, SudooExpressRequest, SudooExpressResponse } from '../../src/declare';
import { SudooExpressHook } from '../../src/hook';
import { MockHandler } from '../mock/handler';
import { promiseSetTimeout } from '../mock/util';

describe('Given {SudooExpressHook} class', (): void => {

    const chance: Chance.Chance = new Chance('sudoo-express-hook');

    const createMockHandler = (onNext?: () => void): SudooExpressHandler =>
        (req: SudooExpressRequest, res: SudooExpressResponse, next: SudooExpressNextFunction) => {
            if (onNext) {
                onNext();
            }
            next();
        };

    it('should be able to wrap handler', async (): Promise<void> => {

        const result: string[] = [];

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>();

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), chance.string());

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            'NEXT',
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to continue process if before is assigned', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .before((req, res, a: string) => (result.push(a), true));

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            expectValue,
            'NEXT',
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to get express information', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();
        const mock: MockHandler = MockHandler.create().request({
            infos: {
                a: expectValue,
            },
        }).response({
            agent: expectValue as any,
        });

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .before((req, res) => (result.push(req.infos.a, res.agent as any), true));

        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            expectValue,
            expectValue,
            'NEXT',
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to stop process if before is assigned', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .before((req, res, a: string) => (result.push(a), false));

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            expectValue,
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to call after hook sync function', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .before((req, res, a: string) => (result.push(a), true))
                .after((req, res, a: string) => (result.push(a), undefined));

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            expectValue,
            'NEXT',
            expectValue,
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to call after hook async function', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .before((req, res, a: string) => (result.push(a), true))
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                .after(async (req, res, a: string) => (await promiseSetTimeout(() => result.push(a), 13), undefined));

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            expectValue,
            'NEXT',
        ]);
        expect(mock.called).to.be.deep.equal([]);

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        await new Promise((resolve) => setTimeout(resolve, 26));
        expect(result).to.be.deep.equal([
            expectValue,
            'NEXT',
            expectValue,
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to call after hook even if before hook is not assigned', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .after((req, res, a: string) => (result.push(a), undefined));

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            'NEXT',
            expectValue,
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });

    it('should be able to not call after hook if before is failed', async (): Promise<void> => {

        const result: string[] = [];
        const expectValue: string = chance.string();

        const hook: SudooExpressHook<[string]> =
            SudooExpressHook.create<[string]>()
                .before((req, res, a: string) => (result.push(a), false))
                .after((req, res, a: string) => (result.push(a), undefined));

        const mock: MockHandler = MockHandler.create();
        const handler: SudooExpressHandler = hook.wrap(createMockHandler(() => result.push('NEXT')), expectValue);

        await handler(mock.req, mock.res, mock.next);

        expect(result).to.be.deep.equal([
            expectValue,
        ]);
        expect(mock.called).to.be.deep.equal(['NEXT']);
    });
});
