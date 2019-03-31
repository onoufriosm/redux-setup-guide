/**
 * This is a service to do all the api calls (get, post, put, delete)
 */

import axios from 'axios';
import { computeUrl } from '../utils';

const api = (method, action) => {
  const url = `http://localhost:8000/${computeUrl(method, action)}`;

  const headers = method === 'GET'
    ? {}
    : {
      'Content-Type': 'application/json',
    };

  const config = { method, url, headers };

  if (method !== 'GET') {
    config.data = action.body;
  }

  return axios
    .request(config)
    .then(response => response.data);
};

export default api;
