/**
 * Higher order component for reading a single entity
 */

/* Dependencies */
import { connect } from 'react-redux';

/* Actions */
import { readEntity } from '../../../../redux/actions';

/* Selectors */
import { selectEntity, selectReadEntityStatus } from '../../../../redux/selectors';

const Container = ({ children, ...rest }) => children(rest);

const mapStateToProps = (state, ownProps) => ({
  entity: selectEntity(state, ownProps.entityName, ownProps.id),
  status: selectReadEntityStatus(state, ownProps.entityName, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  read(options) {
    dispatch(
      readEntity(ownProps.entityName, ownProps.id, options),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
