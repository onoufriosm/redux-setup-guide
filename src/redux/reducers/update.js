import {
  requestStatus,
  receiveStatus,
  failStatus,
  isValidAction,
} from './helpers';

/**
 * Reducer to keep track of the status of update api calls
 */
const updateIds = entityName => (state = {}, action) => {
  const entityNameUppercase = entityName.toUpperCase();
  if (!isValidAction(action, 'UPDATE')) {
    return state;
  }
  switch (action.type) {
    case `REQUEST_UPDATE_${entityNameUppercase}`: {
      return requestStatus(state, action);
    }
    case `SUCCESS_UPDATE_${entityNameUppercase}`: {
      return receiveStatus(state, action);
    }
    case `FAIL_UPDATE_${entityNameUppercase}`: {
      return failStatus(state, action);
    }
    default: {
      return state;
    }
  }
};

export default updateIds;
