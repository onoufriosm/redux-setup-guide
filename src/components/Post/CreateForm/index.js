/* Dependencies */
import React from 'react';

/* Containers */
import { Form, Input, Button } from 'antd';
import CreateContainer from '../../../react-redux/Entity/Create';

/* Components */

class PostCreateForm extends React.Component {
  constructor() {
    super();
    this.state = { text: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ text: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { create } = this.props;
    const { text } = this.state;
    create({ text });
    this.setState({ text: '' });
  }

  render() {
    const { text } = this.state;
    const { status } = this.props;

    return (
      <Form layout='inline' onSubmit={this.handleSubmit}>
        <Form.Item>
          <Input placeholder='Enter text' name='text' value={text} onChange={this.handleChange} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={status && status.isFetching}
            type='primary'
            htmlType='submit'
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const PostCreateFormCreate = ({ userId }) => (
  <CreateContainer entityName='post' parentName='user' parentId={userId}>
    { props => <PostCreateForm {...props} />}
  </CreateContainer>
);

export default PostCreateFormCreate;
