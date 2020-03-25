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
    return {
        type: actionTypes.SAVE_PLAYER_NAME,
        name,
    };
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

export function clickedBox(position) {
    return sendMessage('clicked_box', { position });
}

export function updatedBox({ data: { turnPlayer1, boxes, status, winner } }) {
    return {
        type: actionTypes.UPDATED_BOX,
        turnPlayer1, 
        boxes,
        status, 
        winner
    }
}

export function clearGamePlayerDetails() {
    return {
        type: actionTypes.CLEAR_GAME_PLAYER_DETAILS,
    }
}

export function opponentLeft() {
    return {
        type: actionTypes.OPPONENT_LEFT,
    }
}

export function yourTurn() {
    return {
        type: actionTypes.YOUR_TURN,
    }
}

export function showDesktopNotification(message = '') {
    return {
        type: actionTypes.SHOW_DESKTOP_NOTIFICATION,
        message,
    };
}