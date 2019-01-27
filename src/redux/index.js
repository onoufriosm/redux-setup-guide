import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import middlewares from './middlewares';
import { computeSchema } from './utils';

const schema = {
  user: {
    define: ['posts'],
  },
  post: {
    define: [{ author: 'user' }, 'tags'],
  },
  tag: {
    define: [],
  },
};

export const entitiesSchema = computeSchema(schema);

const getStore = (initialState, options = {}) => {
  if (options.debug) {
    const reduxLogger = createLogger({
      collapsed: true,
    });
    middlewares.push(reduxLogger);
  }
  return createStore(reducers, initialState, composeWithDevTools(applyMiddleware(...middlewares)));
};


export default getStore;
