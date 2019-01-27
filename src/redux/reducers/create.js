import {
  requestStatus,
  receiveStatus,
  failStatus,
  isValidAction,
} from './helpers';

/**
 * Reducer to keep track of the status of create api calls
 */
const createIds = entityName => (state = {}, action) => {
  const entityNameUppercase = entityName.toUpperCase();
  if (!isValidAction(action, 'CREATE')) {
    return state;
  }
  switch (action.type) {
    case `REQUEST_CREATE_${entityNameUppercase}`: {
      return requestStatus(state, action);
    }
    case `SUCCESS_CREATE_${entityNameUppercase}`: {
      return receiveStatus(state, action);
    }
    case `FAIL_CREATE_${entityNameUppercase}`: {
      return failStatus(state, action);
    }
    default: {
      return state;
    }
  }
};

export default createIds;
