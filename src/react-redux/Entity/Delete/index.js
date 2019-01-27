/**
 * Higher order component for deleting an entity
 */

/* Dependencies */
import { connect } from 'react-redux';

/* Actions */
import { deleteEntity } from '../../../redux/actions';

/* Selectors */
import { selectDeleteEntityStatus } from '../../../redux/selectors';

const Container = ({ children, ...rest }) => children(rest);

const mapStateToProps = (state, ownProps) => ({
  status: selectDeleteEntityStatus(state, ownProps.entityName, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  delete(body, options) {
    dispatch(
      deleteEntity(ownProps.entityName, ownProps.id, options),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
