import { getReduxType } from '../utils';
import { getToggleType, getToggleKey } from './helpers';

/**
 * Computes action creator
 * @param  {string} entityName - Any entity type in the system e.g. 'user', 'group' e.t.c
 * @param  {integer} entityId  - The id of the entity to be read
 * @param  {Object} options    - onSuccess and onFail function could be passed here
 * @param  {String} actionType - 'read' | 'update' | 'create' | 'delete'
 * @param  {Boolean} single    - Acting on single entity (false if acting on multiple entities)
 * @param  {Object} body       - Optional param
 */
export const commonActionCreator = (
  entityName,
  entityId,
  options = {},
  actionType,
  single = true,
  body,
) => ({
  type: getReduxType('request', actionType, entityName, false),
  params: { id: entityId },
  body,
  meta: {
    identifier: entityId,
    entityName,
    type: single ? 'single' : 'multi',
    body,
  },
  options,
});

/**
 * Action creator to read a single entity
 */
export const readEntity = (entityName, entityId, options) => (
  commonActionCreator(entityName, entityId, options, 'read')
);

/**
 * Action creator to read a multiple entities entity
 */
export const readEntities = (entityName, params, options = {}) => ({
  type: getReduxType('request', 'read', entityName, true),
  params,
  meta: {
    identifier: JSON.stringify(params),
    entityName,
    type: 'multi',
  },
  options,
});

/**
 * Action creator to update a single entity
 */
export const updateEntity = (entityName, entityId, body, options) => (
  commonActionCreator(entityName, entityId, options, 'update', true, body)
);

/**
 * Action creator to update multiple entities
 */
export const updateEntities = (entityName, entityId, body, options) => (
  commonActionCreator(entityName, entityId, options, 'update', false, body)
);

/**
 * Action creator to delete a single entity
 */
export const deleteEntity = (entityName, entityId, options) => (
  commonActionCreator(entityName, entityId, options, 'delete')
);

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
    identifier: uuid,
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
