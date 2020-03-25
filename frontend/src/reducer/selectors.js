import { createSelector } from 'reselect';
import { getStore } from '../liftapp/store.js';

const tictactoe = state => state.tictactoe;

export const getMyName = createSelector(
    tictactoe, 
    state => state.myName
);

export const getGameDetails = createSelector(
    tictactoe,
    ({ game }) => game,
);

export const isGameOver = createSelector(
    getGameDetails,
    ({ status }) => status && status === 'completed'
);

export const isPlayer1Me = createSelector(
    tictactoe, 
    ({ isPlayer1Me}) => Boolean(isPlayer1Me)
);

export const isPlayer1Turn = createSelector(
    getGameDetails, 
    ({ playTurnPlayer1 }) => Boolean(playTurnPlayer1),
);

export const getMyDetails = createSelector(
    tictactoe,
    ({ player1Details, player2Details, isPlayer1Me }) => {
        return isPlayer1Me ? player1Details : player2Details;
    }
);

export const getOpponentDetails = createSelector(
    tictactoe,
    ({ player1Details, player2Details, isPlayer1Me }) => {
        return isPlayer1Me ? player2Details : player1Details;
    }
);


export const isItMyTurn = createSelector(
    isPlayer1Me,
    isPlayer1Turn,
    (isPlayer1Me, isPlayer1Turn) => {
        if(isPlayer1Me && isPlayer1Turn) return true;
        if(!isPlayer1Me && !isPlayer1Turn) return true;
        return false;
    },
);

export const getOpponentName = createSelector(
    getOpponentDetails, 
    details => details.name
);

export const stateHelper = function(selector) {
    return selector(getStore().getState());
}