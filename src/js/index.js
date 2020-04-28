import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
// import logger from 'redux-logger';
import { Provider } from 'react-redux';
import rootReducer from './redux/rootReducer';

import App from './App';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
