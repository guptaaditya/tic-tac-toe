import generatesagaMiddleware from 'redux-saga';
import tictactoeSagas from '../sagas';

let sagaMiddleware;
const sagas = [
    ...tictactoeSagas,
];

export function createSagaMiddleWare() {
    sagaMiddleware = generatesagaMiddleware();
    return sagaMiddleware;
}

export function runSagas() {
    sagas.map(saga => sagaMiddleware.run(saga));
}