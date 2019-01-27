import { entitiesSchema as schema } from '..';

/* eslint-disable */

const isEntityType = schemaEntity => '_key' in schemaEntity;

const getEntityChildren = schemaEntity => Object.keys(schemaEntity.schema).map((childKey) => {
  const child = schemaEntity.schema[childKey];

  if (child._key) {
    return child._key;
  }

  return child.schema._key;
});

export const nameOfChildKey = (
  parentEntityName,
  childEntityName,
) => {
  const parentSchema = schema[parentEntityName].schema;
  return Object.keys(parentSchema).find(
    key => parentSchema[key].schema._key === childEntityName,
  );
};

export const parentOf = (entityName) => {
  const parent = [];

  // FIXME entity variable name is misleading
  Object.keys(schema).forEach((entity) => {
    const schemaEntity = schema[entity];

    if (isEntityType(schemaEntity)) {
      const children = getEntityChildren(schemaEntity);

      if (
        children.includes(entityName)
        || children.includes(`${entityName}s`)
      ) {
        parent.push(entity);
      }
    }
  });

  return parent;
};

export const getIdAttribute = entityName => schema[entityName]._idAttribute;
