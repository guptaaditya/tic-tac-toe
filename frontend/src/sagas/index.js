import io from 'socket.io-client';
import { takeLatest, put } from 'redux-tale/es/effects';
import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions';
import * as utils from './utils';

let socket = null;
function* onSocketConnectSuccess() {
    yield put(actions.connectServerSuccess());
}

function* onConnectServer() {
    try {
        socket = io.connect('http://localhost');
        yield utils.promisifiedAsyncCall(cb => socket.on('connect', cb));
        yield onSocketConnectSuccess();
    } catch (error) {
        console.log(error);
    }
}

const onConnectServerSaga = takeLatest(actionTypes.CONNECT_SERVER, onConnectServer);

export default [
    onConnectServerSaga,
];