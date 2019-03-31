import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppLayout from './components/Layout';
import * as serviceWorker from './serviceWorker';
import setupStore from './redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock api calls
const axiosMock = new MockAdapter(axios, { delayResponse: 500 });
axiosMock.onGet('http://localhost:8000/user/1').reply(200, {
  id: 1,
  name: 'John',
  posts: [{ id: 1, tags: [{ id: 1, name: 'important' }] }],
});
axiosMock.onGet('http://localhost:8000/tag').reply(200, [
  { id: 1, name: 'important' },
  { id: 2, name: 'serious' },
  { id: 3, name: 'ready' },
]);
axiosMock.onPut('http://localhost:8000/user/1').reply(200, {
  id: 1,
  name: 'James',
});
axiosMock.onPost('http://localhost:8000/post').reply(200, {
  id: 20,
  text: 'My newly created post',
  tags: [],
});
axiosMock.onDelete('http://localhost:8000/post/1').reply(200,{});


const store = setupStore({}, { debug: true });

/* eslint-disable-next-line */
ReactDOM.render(<Provider store={store}><AppLayout /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
