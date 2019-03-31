import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as selectors from '../selectors';
import * as entityActions from '../actions';

import getStore from '..';

const initialValue = { id: 1, text: 'My first post', tags: [1, 5, 8] };

const store = getStore({
  entities: {
    post: {
      byId: {
        1: initialValue,
      },
    },
    tag: {
      byId: {
        1: { id: 1, name: 'tag1' },
        5: { id: 5, name: 'tag5' },
        8: { id: 8, name: 'tag8' },
        19: { id: 19, name: 'tag19' },
      },
    },
  },
});

const axiosMock = new MockAdapter(axios);

const response = { id: 1 };

axiosMock.onAny().reply(200, response);

describe('Entity - Read Entity', () => {
  const entityName = 'tag';
  const entityId = [1, 8];
  const parentName = 'post';
  const parentId = 1;

  it('valid', (done) => {
    const action = entityActions.removeEntity(entityName, entityId, parentName, parentId, {});
    store.dispatch(action);

    expect(
      selectors.selectToggleEntityStatus(
        store.getState(),
        entityName,
        entityId,
        parentName,
        parentId,
      ),
    ).toEqual({
      isFetching: true,
      error: null,
    });

    setTimeout(() => {
      expect(
        selectors.selectToggleEntityStatus(
          store.getState(),
          entityName,
          entityId,
          parentName,
          parentId,
        ),
      ).toEqual({
        isFetching: false,
        error: null,
      });
      expect(
        store.getState().entities.post.byId[1].tags,
      ).toEqual([5]);

      done();
    }, 0);
  });
});
