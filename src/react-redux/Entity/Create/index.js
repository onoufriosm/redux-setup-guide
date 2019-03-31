/**
 * Higher order component for creating an entity
 */

/* Dependencies */
import React from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

/* Actions */
import { createEntity } from '../../../redux/actions';

/* Selectors */
import { selectCreatedEntity, selectCreateEntityStatus } from '../../../redux/selectors';

const Container = ({ children, ...rest }) => children(rest);

const mapStateToProps = (state, ownProps) => ({
  createdEntity: selectCreatedEntity(state, ownProps.entityName, ownProps.uuid),
  status: selectCreateEntityStatus(state, ownProps.entityName, ownProps.uuid),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  create(body, options = {}) {
    const enhancedOptions = {
      ...options,
      onSuccess: () => {
        if (options.onSuccess) {
          options.onSuccess();
        }
        // We need to get a new uuid on success
        ownProps.refreshUuid();
      },
    };
    dispatch(
      createEntity(
        ownProps.entityName,
        ownProps.parentName,
        ownProps.parentId,
        ownProps.uuid,
        body,
        enhancedOptions,
      ),
    );
  },
});


// Here we are passing a unique id to the children to keep track of the operation as there
// is not id that we could use before the entity get created.
const ConnectedChildren = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Container);

export class UuidContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: v4(),
    };
    this.refreshUuid = this.refreshUuid.bind(this);
  }

  refreshUuid() {
    this.setState({ uuid: v4() });
  }

  render() {
    const { uuid } = this.state;

    return (
      <ConnectedChildren
        {...this.props}
        refreshUuid={this.refreshUuid}
        uuid={uuid}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UuidContainer);
