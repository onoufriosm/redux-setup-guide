import {
  readEntity,
  readEntities,
  updateEntity,
  updateEntities,
  createEntity,
  deleteEntity,
  toggleEntity,
} from '.';

describe('readEntity', () => {
  test('Action', () => {
    expect(readEntity('user', 1, {})).toEqual({
      type: 'REQUEST_READ_USER',
      params: { id: 1 },
      body: undefined,
      meta: {
        identifier: 1,
        entityName: 'user',
        type: 'single',
        body: undefined,
      },
      options: {},
    });
  });
});

describe('readEntities', () => {
  test('Action', () => {
    expect(readEntities('user', { group_id: 5 }, {})).toEqual({
      type: 'REQUEST_READ_USER',
      params: { group_id: 5 },
      body: undefined,
      meta: {
        identifier: '{"group_id":5}',
        entityName: 'user',
        type: 'multi',
        body: undefined,
      },
      options: {},
    });
  });
});

describe('updateEntity', () => {
  test('Action', () => {
    expect(updateEntity('user', 1, { name: 'James' }, {})).toEqual({
      type: 'REQUEST_UPDATE_USER',
      params: { id: 1 },
      body: { name: 'James' },
      meta: {
        identifier: 1,
        entityName: 'user',
        type: 'single',
        body: { name: 'James' },
      },
      options: {},
    });
  });
});

describe('updateEntities', () => {
  test('Action', () => {
    expect(updateEntities('user', [1, 4, 5], { name: 'James' }, {})).toEqual({
      type: 'REQUEST_UPDATE_USER',
      params: { id: [1, 4, 5] },
      body: { name: 'James' },
      meta: {
        identifier: [1, 4, 5],
        entityName: 'user',
        type: 'multi',
        body: { name: 'James' },
      },
      options: {},
    });
  });
});

describe('createEntity', () => {
  test('Action', () => {
    expect(createEntity('comment', 'thread', 1, 'uuid', { text: 'My first comment' }, {})).toEqual({
      type: 'REQUEST_CREATE_COMMENT',
      params: { parentName: 'thread', parentId: 1, entityName: 'comment' },
      body: { text: 'My first comment' },
      meta: {
        identifier: 'uuid',
        parentName: 'thread',
        parentId: 1,
        entityName: 'comment',
        uuid: 'uuid',
        type: 'single',
      },
      options: {},
    });
  });
});

describe('deleteEntity', () => {
  test('Action', () => {
    expect(deleteEntity('user', 1, {})).toEqual({
      type: 'REQUEST_DELETE_USER',
      params: { id: 1 },
      body: undefined,
      meta: {
        identifier: 1,
        entityName: 'user',
        type: 'single',
        body: undefined,
      },
      options: {},
    });
  });
});
