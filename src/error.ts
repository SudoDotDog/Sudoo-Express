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
        152: 'Route mode {} not exist',
        218: 'Group: {} already exist',
        219: 'Group: {} not exist',
    });
};

export enum SUDOO_EXPRESS_ERROR_CODE {

    RESPONSE_ALREADY_FAILED = 115,
    RESPONSE_NOT_CLEAN = 116,
    ROUTE_MODE_NOT_EXIST = 152,
    GROUP_ALREADY_EXIST = 218,
    GROUP_NOT_EXIST = 219,
}
