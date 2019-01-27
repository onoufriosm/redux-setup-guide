import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppLayout from './components/Layout';
import * as serviceWorker from './serviceWorker';
import setupStore from './redux';

const store = setupStore({}, { debug: true });

/* eslint-disable-next-line */
ReactDOM.render(<Provider store={store}><AppLayout /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
