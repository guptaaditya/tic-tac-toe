import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isServerConnected: false,
};

export default function TicTacToe(state = initialState, action) {
    switch(action.type) {
        case actionTypes.CONNECT_SERVER_SUCCESS:
            const newState = _.defaults({}, { isServerConnected: true }, state);
            return newState;
        default: 
            return state;
    }
}