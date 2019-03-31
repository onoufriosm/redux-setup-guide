import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as selectors from '../selectors';
import * as entityActions from '../actions';

import getStore from '..';

const store = getStore({});

const axiosMock = new MockAdapter(axios);

const response = [{ id: 1, name: 'John' }, { id: 2, name: 'Peter' }];

axiosMock.onAny().reply(200, response);

describe('Entity - Read Entity', () => {
  const entityName = 'user';
  const params = {};

  it('valid', (done) => {
    const action = entityActions.readEntities(entityName, params, {});
    store.dispatch(action);

    expect(
      selectors.selectReadEntitiesStatus(
        store.getState(),
        entityName,
        params,
      ),
    ).toEqual({
      isFetching: true,
      error: null,
    });

    setTimeout(() => {
      expect(
        selectors.selectReadEntitiesStatus(
          store.getState(),
          entityName,
          params,
        ),
      ).toEqual({
        isFetching: false,
        error: null,
      });
      expect(
        selectors.selectReadEntities(store.getState(), entityName, params),
      ).toEqual(response);

      done();
    }, 0);
  });
});
