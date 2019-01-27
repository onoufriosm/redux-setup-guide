/**
 * Higher order component for creating an entity
 */

/* Dependencies */
import { connect } from 'react-redux';
import { v4 } from 'uuid';

/* Actions */
import { createEntity } from '../../../redux/actions';

/* Selectors */
import { selectCreatedEntity, selectCreateEntityStatus } from '../../../redux/selectors';

const Container = ({ children, ...rest }) => children(rest);

let uuid = null;

const mapStateToProps = (state, ownProps) => ({
  createdEntity: selectCreatedEntity(state, ownProps.entityName, uuid),
  status: selectCreateEntityStatus(state, ownProps.entityName, uuid),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  create(body, options) {
    uuid = v4();
    dispatch(
      createEntity(
        ownProps.entityName,
        ownProps.parentName,
        ownProps.parentId,
        uuid,
        body,
        options,
      ),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
