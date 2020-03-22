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

export function savePlayerName(name) {
    return sendMessage('join_game', { name })
}

export function opponentJoined({ data }) {
    return {
        type: actionTypes.JOINED_PLAYER_SUCCESS,
        data,
    }
}

export function youJoined({ data }) {
    return {
        type: actionTypes.JOINED_YOUR_SUCCESS,
        data,
    }
}

export function sendMessage(eventName, payload) {
    return {
        type: actionTypes.SEND_MESSAGE,
        eventName,
        payload
    }
}

export function initSocket() {
    return {
        type: actionTypes.INIT_SOCKET,
    }
}