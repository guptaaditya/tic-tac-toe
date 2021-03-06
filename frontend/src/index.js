import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import LiftApp from './liftapp';
import { getStore } from './liftapp/store.js';
import { getBrowserFeaturePermissions } from './utils/preRequisites';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import 'izitoast/dist/css/iziToast.min.css';

getBrowserFeaturePermissions();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={getStore()}>
      <LiftApp>
        <App />
      </LiftApp>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
