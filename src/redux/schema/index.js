import { schema } from 'normalizr';

const user = new schema.Entity('user');
const users = new schema.Array(user);

const group = new schema.Entity('group');
const groups = new schema.Array(group);

const tag = new schema.Entity('tag');
const tags = new schema.Array(tag);

user.define({
  groups,
  tags,
});

group.define({
  author: user,
  users,
});

export default {
  user,
  users,
  group,
  groups,
  tag,
  tags,
};
