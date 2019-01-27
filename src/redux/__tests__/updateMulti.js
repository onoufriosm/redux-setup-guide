import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as selectors from '../selectors';
import * as entityActions from '../actions';

import getStore from '..';

const store = getStore({});

const axiosMock = new MockAdapter(axios);

const response = [{ id: 1, name: 'John' }, { id: 2, name: 'Peter' }];

axiosMock.onAny().reply(200, response);

describe('Entity - Update Entities', () => {
  const entityName = 'user';
  const id = [1, 2];

  it('valid', (done) => {
    const action = entityActions.updateEntities(entityName, id);
    store.dispatch(action);

    expect(
      selectors.selectUpdateEntityStatus(
        store.getState(),
        entityName,
        id,
      ),
    ).toEqual({
      isFetching: true,
      error: null,
    });

    setTimeout(() => {
      expect(
        selectors.selectUpdateEntityStatus(
          store.getState(),
          entityName,
          id,
        ),
      ).toEqual({
        isFetching: false,
        error: null,
      });
      expect(
        selectors.selectEntitiesByArray(store.getState(), entityName, id),
      ).toEqual(response);

      done();
    }, 0);
  });
});
