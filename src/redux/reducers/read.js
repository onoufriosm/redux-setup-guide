import { difference } from 'lodash';
import {
  requestStatus,
  receiveStatus,
  failStatus,
  isValidAction,
  mergeWithArray,
  arraify,
} from './helpers';

/**
 * Reducer to keep track of the status of read api calls
 */
const readIds = entityName => (state = {}, action) => {
  const entityNameUppercase = entityName.toUpperCase();
  if (!isValidAction(action)) {
    return state;
  }

  const { type } = action;
  if (type === `REQUEST_READ_${entityNameUppercase}`) {
    return requestStatus(state, action);
  }
  if (type === `SUCCESS_READ_${entityNameUppercase}`) {
    return receiveStatus(state, action);
  }
  if (type === `FAIL_READ_${entityNameUppercase}`) {
    return failStatus(state, action);
  }

  if (type.startsWith('SUCCESS_CREATE_')) {
    if (action.meta.entityName === entityName) {
      return Object.keys(state).reduce((result, key) => {
        const { parentName, parentId } = action.meta;
        const params = JSON.parse(key);
        const keyState = state[key];
        if (typeof params === 'object' && params[`${parentName}_id`] === parentId) {
          return {
            ...result,
            [key]: {
              ...keyState,
              items: mergeWithArray(keyState.items, action.payload.result),
            },
          };
        }
        return { ...result, [key]: keyState };
      }, {});
    }
  }

  if (type.startsWith('SUCCESS_DELETE_')) {
    if (action.meta.entityName === entityName) {
      return Object.keys(state).reduce((result, key) => {
        const params = JSON.parse(key);
        const keyState = state[key];
        const deletedEntitiesArray = arraify(action.meta.identifier);
        if (typeof params === 'object') {
          return {
            ...result,
            [key]: {
              ...keyState,
              items: difference(keyState.items, deletedEntitiesArray),
            },
          };
        }
        return { ...result, [key]: keyState };
      }, {});
    }
  }

  return state;
};

export default readIds;
