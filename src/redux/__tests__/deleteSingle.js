import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as selectors from '../selectors';
import * as entityActions from '../actions';

import getStore from '..';

const initialValue = { id: 1, name: 'Jeff' };

const store = getStore({ entities: { user: { byId: { 1: initialValue } } } });

const axiosMock = new MockAdapter(axios);

const response = {};

axiosMock.onAny().reply(200, response);

describe('Entity - Delete Entity', () => {
  const entityName = 'user';
  const identifier = 1;

  it('valid', (done) => {
    const action = entityActions.deleteEntity(entityName, identifier);
    store.dispatch(action);

    expect(
      selectors.selectDeleteEntityStatus(
        store.getState(),
        entityName,
        identifier,
      ),
    ).toEqual({
      isFetching: true,
      error: null,
    });

    expect(
      selectors.selectEntity(store.getState(), entityName, identifier),
    ).toEqual(initialValue);

    setTimeout(() => {
      expect(
        selectors.selectDeleteEntityStatus(
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
      ).toEqual(initialValue);

      done();
    }, 0);
  });
});
