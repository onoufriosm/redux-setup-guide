import {
  mergeByIds,
  removeDeletedChildFromParent,
  addCreatedChildEntityToParent,
  addChildToParent,
  removeChildFromParent,
} from './helpers';
import { parentOf } from '../utils/schema';

const byId = entityName => (state = {}, action) => {
  if (!action.type.startsWith('SUCCESS_')) {
    return state;
  }

  const { type, meta: { parentName }, payload: { result } } = action;

  if (parentName === entityName && type.includes('SUCCESS_CREATE')) {
    return addCreatedChildEntityToParent(state, action, entityName);
  }

  if (
    action.type.startsWith('SUCCESS_DELETE_')
    && parentOf(entityName).includes(action.meta.entityName)
  ) {
    return removeDeletedChildFromParent(state, action, entityName);
  }

  if (type.startsWith('SUCCESS_ADD') && parentName === entityName) {
    return addChildToParent(state, action, entityName);
  }

  if (type.startsWith('SUCCESS_REMOVE') && parentName === entityName) {
    return removeChildFromParent(state, action, entityName);
  }

  if (result === null || result === undefined) {
    return state;
  }


  return mergeByIds(state, action.payload.entities[entityName]);
};

export default byId;
