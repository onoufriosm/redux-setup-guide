/* Dependencies */
import React from 'react';

/* Containers */
import ReadSingleEntityContainer from '../../react-redux/Entity/Read/Entity';

/* Components */
import UserNameForm from '../User/Name';
import PostCreateForm from '../Post/CreateForm';
import PostList from '../Post/List';


class ShowUser extends React.Component {
  componentDidMount() {
    const { read } = this.props;
    read();
  }

  render() {
    const { entity: user, status } = this.props;

    if (status && !status.isFetching) {
      return (
        <div>
          <div>
            <UserNameForm user={user} />
            <h2>Posts</h2>
            <PostList posts={user.posts} />
          </div>
          <PostCreateForm userId={user.id} />
        </div>
      );
    }
    return <div>Loading user...</div>;
  }
}

const Main = () => (
  <ReadSingleEntityContainer entityName='user' id={1}>
    { props => <ShowUser {...props} /> }
  </ReadSingleEntityContainer>
);

export default Main;
