/**
 * @author WMXPY
 * @namespace Express
 * @description Error
 */

import { Connor } from "connor";

export enum SUDOO_EXPRESS_ERROR_CODE {

    RESPONSE_ALREADY_FAILED = 115,
    RESPONSE_NOT_CLEAN = 116,
    ROUTE_MODE_NOT_EXIST = 152,
    ROUTE_DUPLICATED = 153,
    GROUP_ALREADY_EXIST = 218,
    GROUP_NOT_EXIST = 219,
}

export const registerError = (): Connor => {

    return Connor.dictionary('Sudoo-Express', {

        [SUDOO_EXPRESS_ERROR_CODE.RESPONSE_ALREADY_FAILED]: 'Response already failed by {}',
        [SUDOO_EXPRESS_ERROR_CODE.RESPONSE_NOT_CLEAN]: 'Response not clean',
        [SUDOO_EXPRESS_ERROR_CODE.ROUTE_MODE_NOT_EXIST]: 'Route mode {} not exist',
        [SUDOO_EXPRESS_ERROR_CODE.ROUTE_DUPLICATED]: 'Route {} duplicated',
        [SUDOO_EXPRESS_ERROR_CODE.GROUP_ALREADY_EXIST]: 'Group: {} already exist',
        [SUDOO_EXPRESS_ERROR_CODE.GROUP_NOT_EXIST]: 'Group: {} not exist',
    } as Record<SUDOO_EXPRESS_ERROR_CODE, string>);
};
