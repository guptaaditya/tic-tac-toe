import createTaleMiddleware from 'redux-tale/es/';
import tictactoeSagas from '../sagas';

let sagaMiddleware;
const sagas = [
    ...tictactoeSagas,
];

export function createSagaMiddleWare() {
    sagaMiddleware = createTaleMiddleware();
    return sagaMiddleware;
}

export function runSagas() {
    sagas.map(saga => sagaMiddleware.run(saga));
}