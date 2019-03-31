import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as selectors from '../selectors';
import * as entityActions from '../actions';

import getStore from '..';

const initialValue = { id: 1, name: 'Jeff', posts: [1, 5] };

const store = getStore({
  entities: {
    user: {
      byId: { 1: initialValue },
    },
    post: {
      readIds: {
        '{"user_id":1}': { items: [1, 5] },
      },
    },
  },
});

const axiosMock = new MockAdapter(axios);

const response = {};

axiosMock.onAny().reply(200, response);

describe('Entity - Delete Entity', () => {
  const entityName = 'post';
  const identifier = 5;

  it('valid', (done) => {
    const action = entityActions.deleteEntity(entityName, identifier, {});
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


      expect(store.getState().entities.user.byId[1].posts).toEqual([1]);
      expect(store.getState().entities.post.readIds['{"user_id":1}'].items).toEqual([1]);

      done();
    }, 0);
  });
});
