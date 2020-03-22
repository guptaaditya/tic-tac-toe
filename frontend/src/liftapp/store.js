import { createStore, applyMiddleware, compose } from 'redux';
import combinedReducers from './reducer';
import { createSagaMiddleWare, runSagas } from './sagas';


export default function initStore() {
    const store = createStore(
        combinedReducers,
        compose(
            applyMiddleware(createSagaMiddleWare())
        )
    );
    runSagas();
    return store;
}