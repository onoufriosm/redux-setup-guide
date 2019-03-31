import { denormalize } from 'normalizr';
import { entitiesSchema as schema } from '..';
import { getToggleKey } from '../actions/helpers';

const hasKey = (obj, key) => key in obj;

export const selectDenormalizedEntity = (
  state,
  entityName,
  id,
) => state.entities[entityName].byId[id];

const getEntitiesForDenormalization = state => (
  Object.keys(state.entities).reduce(
    (result, key) => ({ ...result, [key]: state.entities[key].byId }),
    {},
  )
);

export const selectEntity = (state, entityName, id) => (
  denormalize(
    state.entities[entityName].byId[id],
    schema[entityName],
    getEntitiesForDenormalization(state),
  )
);

export const selectEntitiesByArray = (state, entityName, array) => (
  denormalize(
    array,
    schema[`${entityName}s`],
    getEntitiesForDenormalization(state),
  )
);

export const selectReadEntities = (state, entityName, params) => {
  const readId = state
    .entities[entityName].readIds[JSON.stringify(params)];
  if (!readId) {
    return [];
  }

  return selectEntitiesByArray(state, entityName, readId.items);
};

export const selectStatus = (state, entityName, id, key) => {
  const statuses = state.entities[entityName][key];
  return hasKey(statuses, id) ? statuses[id].status : undefined;
};

export const selectReadEntityStatus = (state, entityName, id) => (
  selectStatus(state, entityName, id, 'readIds')
);

export const selectReadEntitiesStatus = (state, entityName, params) => (
  selectStatus(state, entityName, JSON.stringify(params), 'readIds')
);

export const selectUpdateEntityStatus = (state, entityName, id) => (
  selectStatus(state, entityName, id, 'updateIds')
);

export const selectDeleteEntityStatus = (state, entityName, id) => (
  selectStatus(state, entityName, id, 'deleteIds')
);

export const selectCreateEntityStatus = (state, entityName, uuid) => {
  if (!uuid) {
    return undefined;
  }
  const { createIds } = state.entities[entityName];
  const createIdKey = Object.keys(createIds).find(key => key.includes(uuid));
  if (!createIdKey) {
    return undefined;
  }
  return createIds[createIdKey].status;
};

export const selectCreatedEntity = (state, entityName, uuid) => {
  if (!uuid) {
    return undefined;
  }
  const { createIds } = state.entities[entityName];
  const createIdKey = Object.keys(createIds).find(key => key.includes(uuid));
  if (!createIdKey) {
    return undefined;
  }
  const { id } = createIds[createIdKey];
  if (id) {
    return selectEntity(state, entityName, id);
  }
  return undefined;
};

export const selectToggleEntityStatus = (
  state,
  entityName,
  entityIds,
  parentName,
  parentId,
) => {
  const identifier = getToggleKey(
    entityName,
    entityIds,
    parentName,
    parentId,
  );
  const { toggleIds } = state.entities[entityName];

  return hasKey(toggleIds, identifier)
    ? toggleIds[identifier].status
    : false;
};
