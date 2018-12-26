/**
 * @author WMXPY
 * @namespace Mock
 * @description Util
 * @package Unit Test
 */

export const promiseSetTimeout = (func: () => void, delay: number): Promise<void> =>
    new Promise<void>((resolve: () => void) => {
        setTimeout(() => {
            func();
            resolve();
        }, delay);
    });
