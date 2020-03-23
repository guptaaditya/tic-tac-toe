import _ from 'lodash';
import io from 'socket.io-client';
import { showToast } from '../helper';
import { eventChannel } from 'redux-saga';
import { fork, put, call, take } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions';
import { getStore } from '../liftapp/store.js';
import { getMyName } from '../reducer/selectors.js';

let socket;
function* onOpponentLeft() {
    while (true) {
        yield take(actionTypes.OPPONENT_LEFT);
        const storeState = getStore().getState();
        const myName = getMyName(storeState);
        showToast('Opponent has left the game');
        showToast('Joining a new game');
        yield put(actions.clearGamePlayerDetails());
        yield put(actions.savePlayerName(myName));
        yield put(actions.sendMessage('join_game', { name: myName }));
    }
}
function connectServer() {
    try {
        const socket = io.connect(window.location.protocol+'//'+window.location.hostname);
        return new Promise(resolve => {
            socket.on('connect', () => {
                resolve(socket);
            });
        });
    } catch (error) {
        console.log(error);
    }
}

function subscribe(socket) {
    return new eventChannel(emit => {
        const messages = {
            'other_player_joined': actions.opponentJoined, 
            'you_joined': actions.youJoined,
            'updated_box': actions.updatedBox,
            'opponent_left': actions.opponentLeft,
        };
        _.forEach(messages, (action, msg) => {
            socket.on(msg, (data) => {
                emit(action({ msg, data }));
            });
        })
        return () => {
            socket.disconnect();
        };
    });
}

function* read(socket) {
    const channel = yield call(subscribe, socket);
    while (true) {
      let action = yield take(channel);
      yield put(action);
    }
}
  
function* write(socket) {
    while (true) {
        const { eventName, payload } = yield take(actionTypes.SEND_MESSAGE);
        socket.emit(eventName, payload);
    }
}

function* onInitSocket() {
    socket = yield call(connectServer);
    yield put(actions.connectServerSuccess());
    yield fork(write, socket);
    yield fork(read, socket);
}

export default [
    onInitSocket,
    onOpponentLeft,
];