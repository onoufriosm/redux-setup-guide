import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as selectors from '../selectors';
import * as entityActions from '../actions';

import getStore from '..';

const store = getStore({})

const axiosMock = new MockAdapter(axios);

const response = { id: 1, name: 'Jeff' };

axiosMock.onAny().reply(200, response);

describe('Entity - Read Entity', () => {
  const entityName = 'user';
  const identifier = 1;

  it('valid', (done) => {
    const action = entityActions.readEntity(entityName, identifier);
    store.dispatch(action);

    expect(
      selectors.selectReadEntityStatus(
        store.getState(),
        entityName,
        identifier,
      ),
    ).toEqual({
      isFetching: true,
      error: null,
    });

    setTimeout(() => {
      expect(
        selectors.selectReadEntityStatus(
          store.getState(),
          entityName,
          identifier,
        ),
      ).toEqual({
        isFetching: false,
        error: null,
      });
      expect(
        selectors.selectEntity(store.getState(), entityName, identifier),
      ).toEqual(response);

      done();
    }, 0);
  });
});
