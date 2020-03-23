import { createSelector } from 'reselect'

const tictactoe = state => state.tictactoe;

export const getMyDetails = createSelector(
    tictactoe,
    ({ player1Details, player2Details, isPlayer1Me }) => {
        return isPlayer1Me ? player1Details : player2Details;
    }
)
export const getOpponentDetails = createSelector(
    tictactoe,
    ({ player1Details, player2Details, isPlayer1Me }) => {
        return isPlayer1Me ? player1Details : player2Details;
    }
)

export const getMyName = createSelector(tictactoe, state => state.myName);
export const getOpponentName = createSelector(getOpponentDetails, details => details.name);