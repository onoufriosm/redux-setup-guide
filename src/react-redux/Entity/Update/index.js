/**
 * Higher order component for updating an entity
 */

/* Dependencies */
import { connect } from 'react-redux';

/* Actions */
import { updateEntity } from '../../../redux/actions';

/* Selectors */
import { selectUpdateEntityStatus } from '../../../redux/selectors';

const Container = ({ children, ...rest }) => children(rest);

const mapStateToProps = (state, ownProps) => ({
  status: selectUpdateEntityStatus(state, ownProps.entityName, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  update(body, options) {
    dispatch(
      updateEntity(ownProps.entityName, ownProps.id, body, options),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
