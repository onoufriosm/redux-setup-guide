import { schema } from 'normalizr';

/**
 * Returns the redux type
 */
export const getReduxType = (status, method, entityName) => (
  `${status}_${method}_${entityName}`.toUpperCase()
);

/**
 * Computes the url to be called depending on the action
 * (This will be different for every project)
 */
export const computeUrl = (method, action) => {
  if (action.type.includes('ADD') || action.type.includes('REMOVE')) {
    const {
      parentName, entityName, parentId, entityIds,
    } = action.meta;
    return `${parentName}/${parentId}/${entityName}/${entityIds}`;
  }
  if (method === 'GET' && action.meta.type === 'multi') {
    return `${action.meta.entityName}`;
  }
  if (method === 'GET' || method === 'PUT') {
    return `${action.meta.entityName}/${action.meta.identifier}`;
  }
  if (method === 'POST') {
    return `${action.meta.entityName}`;
  }
  if (method === 'DELETE') {
    return `${action.meta.entityName}/${action.params.id}`;
  }
  return '';
};

/**
 * Returns the plural of an entity name
 */
const pluralizeEntityName = (plural, key) => (
  plural || `${key}s`
);

/**
 * Computes entity.define({ ... }) for normalizr library
 */
const getDefinition = (definitions, entities) => (
  definitions.reduce((result, definition) => {
    if (typeof definition === 'object') {
      const key = Object.keys(definition)[0];
      const value = definition[key];
      return { ...result, [key]: entities[value] };
    }
    return { ...result, [definition]: entities[definition] };
  }, {})
);

/**
 * Computes schema using normalizr Entity and Array
 */
export const computeSchema = (userSchema) => {
  const entities = Object.keys(userSchema).reduce((result, key) => {
    const keySchema = userSchema[key];
    const entitySchema = new schema.Entity(key);
    const entitiesSchema = new schema.Array(entitySchema);
    const pluralKey = pluralizeEntityName(keySchema.plural, key);
    return { ...result, [key]: entitySchema, [pluralKey]: entitiesSchema };
  }, {});

  Object.keys(userSchema).forEach((key) => {
    const keySchema = userSchema[key];
    const definition = getDefinition(keySchema.define, entities);
    entities[key].define(definition);
  });
  return entities;
};
