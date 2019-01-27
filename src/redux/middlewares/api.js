import api from '../services/api';

/**
 * Middleware to do the api call and send success or fail action
 * depending on the response
 */
const apiMiddleware = store => next => (action) => {
  let call = null;
  const { type } = action;
  if (type.startsWith('REQUEST_READ_')) {
    call = 'get';
  }
  if (type.startsWith('REQUEST_CREATE_')) {
    call = 'post';
  }
  if (type.startsWith('REQUEST_UPDATE_') || type.startsWith('REQUEST_ADD_')) {
    call = 'put';
  }
  if (type.startsWith('REQUEST_DELETE_') || type.startsWith('REQUEST_REMOVE_')) {
    call = 'delete';
  }

  if (call) {
    api(store, action, call)
      .then((response) => {
        store.dispatch({
          type: action.type.replace('REQUEST', 'SUCCESS'),
          payload: response,
          meta: action.meta,
        });
        return response;
      })
      .then((response) => {
        if (action.options.onSuccess) {
          action.options.onSuccess(response);
        }
      })
      .catch((error) => {
        store.dispatch({
          type: action.type.replace('REQUEST', 'FAIL'),
          error,
          meta: action.meta,
        });
        if (action.options.onFail) {
          action.options.onFail(error);
        }
      });
  }

  next(action);
};

export default apiMiddleware;
