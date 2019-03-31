import {
  requestStatus,
  receiveStatus,
  failStatus,
} from './helpers';

/**
 * Reducer to keep track of the status of toggle api calls
 */
const toggleIds = entityName => (state = {}, action) => {
  if (!(action.type && (action.type.includes('ADD') || action.type.includes('REMOVE')) && action.meta.entityName === entityName)) {
    return state;
  }

  if (action.type.startsWith('REQUEST')) {
    return requestStatus(state, action);
  } if (action.type.startsWith('SUCCESS')) {
    return receiveStatus(state, action);
  } if (action.type.startsWith('FAIL')) {
    return failStatus(state, action);
  }
  return state;
};

export default toggleIds;
