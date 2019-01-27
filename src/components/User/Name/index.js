/* Dependencies */
import React from 'react';

/* Containers */
import {
  Button,
  Icon,
} from 'antd';
import UpdateSingleEntityContainer from '../../../react-redux/Entity/Update';

class UserNameForm extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { toggled: false, name: props.user.name };
  }

  toggle() {
    const { user: { name } } = this.props;
    this.setState({ toggled: true, name });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { update } = this.props;
    const { name } = this.state;
    update({ name }, { onSuccess: () => this.setState({ toggled: false, name: '' }) });
  }

  handleChange(evt) {
    this.setState({ name: evt.target.value });
  }

  render() {
    const { user, status } = this.props;
    const { toggled, name } = this.state;
    return (
      <div>
        { !toggled ? (
          <div style={{ display: 'flex' }}>
            <p>{ user.name }</p>
            <Icon
              style={{ marginLeft: 20, cursor: 'pointer' }}
              size='small'
              type='edit'
              onClick={this.toggle}
            />
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <input name='name' value={name} onChange={this.handleChange} />
            <Button onClick={this.handleSubmit} type='submit' loading={status && status.isFetching}>Update</Button>
          </form>
        )}
      </div>
    );
  }
}

const UserNameFormContainer = ({ user }) => (
  <UpdateSingleEntityContainer entityName='user' id={user.id}>
    { ({ update, status }) => <UserNameForm user={user} update={update} status={status} /> }
  </UpdateSingleEntityContainer>
);

export default UserNameFormContainer;
