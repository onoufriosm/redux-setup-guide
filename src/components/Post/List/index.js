import React from 'react';

import {
  Card, Icon, List, Button,
} from 'antd';
import Tags from '../../Tag/List';
import TagSelect from '../../Tag/Select';

import DeleteSingleEntityContainer from '../../../react-redux/Entity/Delete';

const { Meta } = Card;

const Post = ({ post }) => (
  <Card
    style={{ width: '100%' }}
    cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}
    actions={[
      <DeleteSingleEntityContainer entityName='post' id={post.id}>
        { props => (
          <Button
            loading={props.status && props.status.isFetching}
            onClick={props.delete}
          >
            <Icon type='delete' />
          </Button>
        )}
      </DeleteSingleEntityContainer>,
      <TagSelect 
        viewComponent={({ toggleModal }) => (
          <Button onClick={toggleModal}>
            <Icon type='tag' />
          </Button>
        )}
        selectedTags={post.tags} 
        parentId={post.id}
      />,
    ]}
  >
    <Meta
      description={(
        <div>
          <p>{post.text}</p>
          <Tags tags={post.tags} />
        </div>
      )}
    />
  </Card>
);

const PostList = ({ posts }) => (
  <List
    grid={{ gutter: 12, column: 4 }}
    dataSource={posts}
    renderItem={post => <List.Item><Post post={post} /></List.Item>}
  />
);

export default PostList;
