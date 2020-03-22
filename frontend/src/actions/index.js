import * as actionTypes from './actionTypes';

export function connectServer() {
    return {
        type: actionTypes.CONNECT_SERVER,
    }
}

export function connectServerSuccess() {
    return {
        type: actionTypes.CONNECT_SERVER_SUCCESS,
    }
}