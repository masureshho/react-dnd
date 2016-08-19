export const dragSource = {
  collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  },

  spec: {
    beginDrag(props) {
      return {
        list: props.list,
        index: props.index,
        id: props.item,
      };
    },

    isDragging(props, monitor) {
      return props.item === monitor.getItem().id;
    },

    endDrag(props, monitor) {
      if (!monitor.didDrop()) {
        return;
      }
      props.updateWorkflow();
    }
  },
};

export const dropTarget = {
  collect(connect) {
    return {
      connectDropTarget: connect.dropTarget(),
    };
  },

  spec: {
    hover(props, monitor) {
      if (!monitor.canDrop()) {
        return;
      }

      const item = monitor.getItem();
      const target = { list: props.list, index: props.index, id: props.item };
      const positionChanged = item.list !== target.list || item.index !== target.index;
      if (positionChanged) {
        props.moveCard(item, target);
      }
    },
  },
};
