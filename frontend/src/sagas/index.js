import _ from 'lodash';
import io from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { fork, put, call, take } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions';

let socket;
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
];