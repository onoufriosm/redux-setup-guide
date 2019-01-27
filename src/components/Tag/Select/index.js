import React from 'react';

import {
  Modal, Spin, Tag,
} from 'antd';
import ReadMultiEntitiesContainer from '../../../react-redux/Entity/Read/Entities';
import ToggleEntityContainer from '../../../react-redux/Entity/Toggle';

const isChecked = (selectedTags, tag) => selectedTags.map(t => t.id).indexOf(tag.id) > -1;

class TagSelect extends React.Component {
  constructor() {
    super();
    this.state = { visible: false, hasRead: false };
    this.toggleModal = this.toggleModal.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.visible) {
      return {
        ...state,
        hasRead: true,
      };
    }
    return state;
  }

  componentDidUpdate(prevProps, prevState) {
    const { read } = this.props;
    const { hasRead } = this.state;
    if (!prevState.hasRead && hasRead) {
      read();
    }
  }

  toggleModal() {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }

  render() {
    const {
      viewComponent, status, tags, selectedTags, parentId,
    } = this.props;
    const { visible } = this.state;

    return (
      <div>
        {viewComponent({ toggleModal: this.toggleModal })}
        <Modal
          visible={visible}
          title='Select tags'
          onOk={this.toggleModal}
          onCancel={this.toggleModal}
          okText='Done'
        >
          { status && status.isFetching ? (
            <Spin />
          ) : (
            <div>
              { tags.map(tag => (
                <ToggleEntityContainer
                  entityName='tag'
                  entityIds={tag.id}
                  parentName='post'
                  parentId={parentId}
                  key={tag.id}
                >
                  {({ toggle }) => (
                    <Tag.CheckableTag
                      checked={isChecked(selectedTags, tag)}
                      onChange={() => {
                        if (status && status.isFetching) {
                          return;
                        }
                        toggle(isChecked(selectedTags, tag) ? 'remove' : 'add');
                      }}
                    >
                      { tag.name }
                    </Tag.CheckableTag>
                  )}
                </ToggleEntityContainer>
              )) }
            </div>
          ) }
        </Modal>
      </div>
    );
  }
}


const TagSelectContainer = ({ selectedTags, viewComponent, parentId }) => (
  <ReadMultiEntitiesContainer entityName='tag' params={{}}>
    {({ entities: tags, status, read }) => (
      <TagSelect
        tags={tags}
        status={status}
        read={read}
        selectedTags={selectedTags}
        viewComponent={viewComponent}
        parentId={parentId}
      />
    )}
  </ReadMultiEntitiesContainer>
);

export default TagSelectContainer;
