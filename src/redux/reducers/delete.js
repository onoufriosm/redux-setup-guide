import {
  requestStatus,
  receiveStatus,
  failStatus,
  isValidAction,
} from './helpers';

/**
 * Reducer to keep track of the status of delete api calls
 */
const deleteIds = entityName => (state = {}, action) => {
  const entityNameUppercase = entityName.toUpperCase();
  if (!isValidAction(action, 'DELETE')) {
    return state;
  }
  switch (action.type) {
    case `REQUEST_DELETE_${entityNameUppercase}`: {
      return requestStatus(state, action);
    }
    case `SUCCESS_DELETE_${entityNameUppercase}`: {
      return receiveStatus(state, action);
    }
    case `FAIL_DELETE_${entityNameUppercase}`: {
      return failStatus(state, action);
    }
    default: {
      return state;
    }
  }
};

export default deleteIds;
