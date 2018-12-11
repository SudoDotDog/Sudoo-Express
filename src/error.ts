/**
 * @author WMXPY
 * @namespace Express
 * @description Error
 */

import Connor from 'connor';

export const registerError = (): Connor => {

    return Connor.dictionary('Sudoo-Express', {

        115: 'Response already failed by {}',
        116: 'Response not clean',
    });
};

export enum SUDOO_EXPRESS_ERROR_CODE {

    RESPONSE_ALREADY_FAILED = 115,
    RESPONSE_NOT_CLEAN = 116,
}

