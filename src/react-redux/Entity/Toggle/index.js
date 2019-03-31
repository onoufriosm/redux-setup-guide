/**
 * Higher order component for toggling entity(ies)
 */

/* Dependencies */
import { connect } from 'react-redux';

/* ACTIONS */
import { addEntity, removeEntity } from '../../../redux/actions';

/* Selectors */
import { selectToggleEntityStatus } from '../../../redux/selectors';

/* Container */
const Container = ({ children, ...rest }) => children(rest);

const mapStateToProps = (state, ownProps) => ({
  status: selectToggleEntityStatus(
    state,
    ownProps.entityName,
    ownProps.entityIds,
    ownProps.parentName,
    ownProps.parentId,
  ),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  /**
   * Add or Remove a child Entity to/from parentEntity
   * @param  {string} action - 'add'/'remove'
   * @param  {array|number} ids - EntityIds
   * @param  {object} options - Additional options
   */
  toggle(action, ids, options = {}) {
    // Ownprops get priority
    const actionType = ownProps.action || action;
    const entityIds = ownProps.entityIds || ids;

    if (actionType === 'add') {
      dispatch(
        addEntity(
          ownProps.entityName,
          entityIds,
          ownProps.parentName,
          ownProps.parentId,
          options,
        ),
      );
    } else if (actionType === 'remove') {
      dispatch(
        removeEntity(
          ownProps.entityName,
          entityIds,
          ownProps.parentName,
          ownProps.parentId,
          options,
        ),
      );
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Container);
