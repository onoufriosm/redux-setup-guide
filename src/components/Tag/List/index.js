/* Dependencies */
import React from 'react';

/* Components */
import { Tag } from 'antd';

const Tags = ({ tags }) => (
  <div>
    { tags.map(tag => (
      <Tag key={tag.id}>
        { tag.name }
      </Tag>
    )) }
  </div>
);

export default Tags;
