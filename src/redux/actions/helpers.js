import { getReduxType } from '../utils';

/**
 * Returns the common action fields for a single entity type action
 */
export const getCommonSingle = (entityName, entityId, options = {}, type) => ({
  type: getReduxType('request', type, entityName, false),
  // TODO: const idAttribute = getIdAttribute(entityName);
  params: { id: entityId },
  meta: {
    identifier: entityId,
    entityName,
    type: 'single',
  },
  options,
});

/**
 * Returns the common action fields for a mutli entities type action
 */
export const getCommonMulti = (entityName, params, options = {}, type) => ({
  type: getReduxType('request', type, entityName, true),
  params,
  meta: {
    identifier: JSON.stringify(params),
    params,
    entityName,
    type: 'multi',
  },
  options,
});

/**
 * Computes the redux type for toggling entities
 */
export const getToggleType = (action, entityName, parentName) => {
  const actionUpperCase = action.toUpperCase();
  const entityNameUpperCase = entityName.toUpperCase();
  const verb = action === 'remove' ? 'FROM' : 'TO';
  const parentNameUpperCase = parentName.toUpperCase();
  return `REQUEST_${actionUpperCase}_${entityNameUpperCase}_${verb}_${parentNameUpperCase}`;
};

/**
 * Computes the identifier key for toggling an entity
 */
export const getToggleKey = (entityName, entityIds, parentName, parentId) => (
  `${parentName}_id=${parentId}_toggle_${entityName}_id=${entityIds}`
);
