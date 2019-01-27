import { normalize } from 'normalizr';
import { entitiesSchema } from '..';

/**
 * Middleware to normalize the response
 */
const normalizeMiddlewre = () => next => (action) => {
  if (action.type.startsWith('SUCCESS_') && !action.type.startsWith('SUCCESS_DELETE')) {
    const schemaToNormalize = action.meta.type === 'single'
      ? entitiesSchema[action.meta.entityName]
      : entitiesSchema[`${action.meta.entityName}s`];

    next({
      ...action,
      payload: normalize(action.payload, schemaToNormalize),
    });
  } else {
    next(action);
  }
};

export default normalizeMiddlewre;
