import { getReduxType } from '../utils';
import {
  getCommonSingle, getCommonMulti, getToggleType, getToggleKey,
} from './helpers';

/**
 * Action creator to read a single entity
 */
export const readEntity = (entityName, entityId, options) => (
  getCommonSingle(entityName, entityId, options, 'read')
);

/**
 * Action creator to read a multiple entities entity
 */
export const readEntities = (entityName, params, options) => (
  getCommonMulti(entityName, params, options, 'read')
);

/**
 * Action creator to update a single entity
 */
export const updateEntity = (entityName, entityId, body, options) => {
  const common = getCommonSingle(entityName, entityId, options, 'update');
  return {
    ...common,
    body,
    meta: {
      ...common.meta,
      body,
    },
  };
};

/**
 * Action creator to update multiple entities
 */
export const updateEntities = (entityName, entityId, body, options) => {
  const common = getCommonSingle(entityName, entityId, options, 'update');
  return {
    ...common,
    body,
    meta: {
      ...common.meta,
      body,
      type: 'multi',
    },
  };
};

/**
 * Action creator to delete a single entity
 */
export const deleteEntity = (entityName, entityId, options) => (
  getCommonSingle(entityName, entityId, options, 'delete')
);

/**
 * Returns a unique identifier for creating an entity
 */
const getCreateIdentifier = (entityName, parentName, parentId, uuid) => {
  let identifier = '';
  if (parentName) {
    identifier = `${parentName}_${parentId}&`;
  }
  return `${identifier}${uuid}`;
};

/**
 * Action creator to create a single entity
 */
export const createEntity = (
  entityName,
  parentName,
  parentId,
  uuid,
  body,
  options = {},
) => ({
  type: getReduxType('request', 'create', entityName),
  params: { parentName, parentId, entityName },
  body,
  meta: {
    identifier: getCreateIdentifier(entityName, parentName, parentId, uuid),
    entityName,
    parentName,
    parentId,
    uuid,
    type: 'single',
  },
  options,
});

/**
 * Action creator to toggle (attach/detach in many to many relationship) single/multi entity(ies)
 */
export const toggleEntity = (action, entityName, entityIds, parentName, parentId, options) => {
  const metaType = Array.isArray(entityIds) ? 'multi' : 'single';
  const type = getToggleType(action, entityName, parentName);
  return {
    type,
    params: {
      entityName, parentName, parentId, entityIds,
    },
    meta: {
      identifier: getToggleKey(entityName, entityIds, parentName, parentId),
      entityName,
      parentName,
      parentId,
      entityIds,
      type: metaType,
    },
    options,
  };
};

/**
 * Action creator to add entitiy(ies)
 */
export const addEntity = (...args) => toggleEntity('add', ...args);

/**
 * Action creator to remove entitiy(ies)
 */
export const removeEntity = (...args) => toggleEntity('remove', ...args);


/**
 * Action creator to set entitiy(ies)
 */
export const setEntity = (...args) => toggleEntity('set', ...args);
