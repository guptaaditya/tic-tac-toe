import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isServerConnected: false,
    isOpponentConnected: false,
    isPlayer1Me: false,
    player1Details: null,
    player2Details: null,
    game: {
        status: 'started',
        boxes: [],
        playTurnPlayer1: true,
        winner: '',
    },
};

export default function TicTacToe(state = initialState, action) {
    switch(action.type) {
        case actionTypes.CONNECT_SERVER_SUCCESS: 
            return handleServerConnectSuccess(state, action);
        case actionTypes.JOINED_YOUR_SUCCESS:
            return handle_I_JoinedSuccess(state, action);
        case actionTypes.JOINED_PLAYER_SUCCESS:
            return handleOpponentJoinedSuccess(state, action);
        case actionTypes.UPDATED_BOX:
            return handleBoxUpdated(state, action);
        default: 
            return state;
    }
}

function handleServerConnectSuccess(state, action) {
    return _.defaults({}, { isServerConnected: true }, state);
}

function handle_I_JoinedSuccess(state, action) {
    const { joined, player1Details, player2Details } = action.data;
    let { isPlayer1Me } = state; 
    if (joined === 'player1') {
        isPlayer1Me = true;
    }
    const isOpponentConnected = Boolean(player2Details);
    return _.defaults({}, { 
        isOpponentConnected, 
        player1Details, 
        player2Details, 
        isPlayer1Me 
    }, state);
}

function handleOpponentJoinedSuccess(state, action) {
    const { joined, player1Details, player2Details } = action.data;
    let { isPlayer1Me } = state; 
    const isOpponentConnected = true;
    if (joined === 'player1') {
        isPlayer1Me = false;
    }

    return _.defaults({}, { 
        isOpponentConnected, 
        player1Details, 
        player2Details, 
        isPlayer1Me 
    }, state);
}

function handleBoxUpdated(state, action) {
    const { turnPlayer1: playTurnPlayer1, boxes, status, winner } = action;
    const newGame = { boxes, playTurnPlayer1, status, winner };
    return _.defaults({}, { 'game': newGame }, state);
}