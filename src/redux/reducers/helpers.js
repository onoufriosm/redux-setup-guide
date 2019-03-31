import {
  isEmpty, clone, union,
} from 'lodash';
import { entitiesSchema as schema } from '..';

export const arraify = n => (Array.isArray(n) ? n : [n]);

export const mergeWithArray = (state, result) => union(
  state,
  arraify(result),
);

export const requestStatus = (state, action) => ({
  ...state,
  [action.meta.identifier]: {
    status: {
      isFetching: true,
      error: null,
    },
  },
});

export const receiveStatus = (state, action, args = {}) => ({
  ...state,
  [action.meta.identifier]: {
    ...args,
    items: action.payload.result,
    status: {
      isFetching: false,
      error: null,
    },
  },
});

export const failStatus = (state, action, args = {}) => ({
  ...state,
  [action.meta.identifier]: {
    ...state[action.meta.identifier],
    ...args,
    status: {
      isFetching: false,
      error: action.error,
    },
  },
});

export const mergeByIds = (state, entities) => {
  // When nested entity is empty in normalizr it does not appear under entities therefore
  // we need to check for undefined. Also if entities is null or empty just return state
  if (
    typeof entities === 'undefined'
    || entities == null
    || isEmpty(entities)
  ) {
    return state;
  }

  // Merge entities and state common keys as they might have different fields
  const mergedEntities = Object.keys(entities).reduce(
    (result, current) => {
      const item = clone(result);
      item[current] = current in state
        ? { ...state[current], ...entities[current] }
        : entities[current];
      return item;
    },
    {},
  );

  return { ...state, ...mergedEntities };
};

export const isValidAction = (action, reducer) => {
  const { type } = action;
  if (
    !type.startsWith(`REQUEST_${reducer}`)
    || !type.startsWith(`SUCCESS_${reducer}`)
    || !type.startsWith(`FAIL_${reducer}`)
  ) {
    return true;
  }
  return false;
};

export const nameOfChildKey = (
  parentEntityName,
  childEntityName,
) => {
  const parentSchema = schema[parentEntityName].schema;
  return Object.keys(parentSchema).find(
    /* eslint-disable-next-line */
    key => parentSchema[key].schema._key === childEntityName,
  );
};

export const removeDeletedChildFromParent = (
  state,
  action,
  entityName,
) => Object.keys(state).reduce((result, key) => {
  const childKey = nameOfChildKey(entityName, action.meta.entityName);

  if (!state[key][childKey]) {
    return { ...result, [key]: state[key] };
  }

  // TODO: Write test. This is to reduce the number of count when deleting an entity.

  return {
    ...result,
    [key]: {
      ...state[key],
      [childKey]: state[key][childKey].filter(
        (id) => {
          const { identifier } = action.meta;
          if (Array.isArray(identifier)) {
            return identifier.indexOf(id) === -1;
          }
          return id !== identifier;
        },
      ),
    },
  };
}, {});


export const addCreatedChildEntityToParent = (
  state,
  action,
  entityName,
) => {
  const { parentName, parentId } = action.meta;
  if (entityName === parentName) {
    // Sometimes parentId does not exist in state (e.g. when visiting experiment_complete directly)
    if (!state[parentId]) {
      return state;
    }

    let stateWithUpdatedChildren = { ...state };
    const childKey = nameOfChildKey(entityName, action.meta.entityName);

    // OneToMany associations
    const childrenArray = state[parentId][childKey] || [];
    const updatedParentState = {
      ...state[action.meta.parentId],
      [childKey]: mergeWithArray(childrenArray, action.payload.result),
    };

    stateWithUpdatedChildren = {
      ...state,
      [action.meta.parentId]: updatedParentState,
    };

    return mergeByIds(
      stateWithUpdatedChildren,
      action.payload.entities[entityName],
    );
  }

  return state;
};

export const addChildToParent = (state, action, entityName) => {
  const childKey = nameOfChildKey(entityName, action.meta.entityName);
  const childrenArray = state[action.meta.parentId][childKey] || [];

  return {
    ...state,
    [action.meta.parentId]: {
      ...state[action.meta.parentId],
      [childKey]: mergeWithArray(childrenArray, action.meta.entityIds),
    },
  };
};

export const removeChildFromParent = (
  state,
  action,
  entityName,
) => {
  const childKey = nameOfChildKey(entityName, action.meta.entityName);

  let newState = { ...state };

  const parent = state[action.meta.parentId];
  const children = Boolean(parent) && state[action.meta.parentId][childKey];

  if (parent && children) {
    const filteredChildren = children.filter(
      (id) => {
        const { entityIds } = action.meta;
        if (Array.isArray(entityIds)) {
          return entityIds.indexOf(id) === -1;
        }
        return id !== entityIds;
      },
    );

    newState = {
      ...state,
      [action.meta.parentId]: {
        ...state[action.meta.parentId],
        [childKey]: filteredChildren,
      },
    };
  }

  return newState;
};
