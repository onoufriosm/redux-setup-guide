import axios from 'axios';
import { computeUrl } from '../utils';

const call = (method, store, action) => {
  const url = `http://localhost:8000/${computeUrl(method, action)}`;

  const headers = method === 'GET'
    ? {}
    : {
      'Content-Type': 'application/json',
    };

  const config = {
    method,
    url,
    headers,
  };
  if (method !== 'GET') {
    config.data = action.body;
  }

  return axios
    .request(config)
    .then(response => response.data);
};

/**
 * Send a GET request
 */
export const get = (store, action) => call('GET', store, action);

/**
 * Send a POST request
 */
export const post = (store, action) => call('POST', store, action);

/**
 * Send a PUT request
 */
export const put = (store, action) => call('PUT', store, action);

/**
 * Send a DELETE request
 */
export const destroy = (store, action) => call('DELETE', store, action);

const api = (store, action, type) => {
  switch (type) {
    case 'get':
      return get(store, action);
    case 'post':
      return post(store, action);
    case 'put':
      return put(store, action);
    case 'delete':
      return destroy(store, action);
    default:
      return new Error('Invalid request');
  }
};

export default api;
