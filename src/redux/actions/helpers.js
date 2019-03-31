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
