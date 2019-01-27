import {
  mergeByIds, removeChildFromParent, addChildEntityToParent, addChildToParent, removeManyToMany,
} from './helpers';
import { parentOf } from '../utils/schema';

const byId = entityName => (state = {}, action) => {
  if (!action.type.startsWith('SUCCESS_')) {
    return state;
  }

  const { type, meta: { parentName } } = action;

  if (
    parentName === entityName
    && type.includes('SUCCESS_CREATE')
  ) {
    return addChildEntityToParent(state, action, entityName);
  }

  if (
    action.type.startsWith('SUCCESS_DELETE_')
    && parentOf(entityName).includes(action.meta.entityName)
  ) {
    return removeChildFromParent(state, action, entityName);
  }

  if (
    type.startsWith('SUCCESS_ADD')
    && parentName === entityName
  ) {
    return addChildToParent(state, action, entityName);
  }
  if (
    type.startsWith('SUCCESS_REMOVE')
    && parentName === entityName
  ) {
    return removeManyToMany(state, action, entityName);
  }

  // TODO:
  // if (
  //   type.startsWith('SUCCESS_SET') &&
  //   parentName === entityName
  // ) {
  //   return setManyToMany(state, action, entityName);
  // }

  // TODO: Refactor. This will fail if result is 0
  if (!action.payload.result) {
    return state;
  }


  return mergeByIds(state, action.payload.entities[entityName]);
};

export default byId;
