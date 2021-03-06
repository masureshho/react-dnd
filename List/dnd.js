import { findDOMNode } from 'react-dom';

export const dragSource = {
  collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    };
  },

  spec: {
    beginDrag(props) {
      return {
        index: props.index,
        id: props.listId
      };
    },

    isDragging(props, monitor) {
      return props.listId === monitor.getItem().id;
    },

    endDrag(props, monitor) {
      if (!monitor.didDrop()) {
        return;
      }
      props.updateWorkflow();
    }
  },
};

const hover = {
  card(props, monitor, component) {
    if (monitor.isOver({ shallow:true }) && monitor.canDrop()) {
      const item = monitor.getItem();
      const target = { list: props.index };
      const titleRect = findDOMNode(component).firstChild.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (clientOffset.y <= titleRect.bottom) {
        target.index = 0;
      } else {
        target.index = Math.max(props.lists.length - 1, 0);
      }

      if (item.list !== target.list || item.index !== target.index) {
        props.moveCard(item, target);
      }
    }
  },

  list(props, monitor) {
    const item = monitor.getItem();
    const target = { index: props.index };
    if (item.index !== target.index && monitor.canDrop()) {
      props.moveList(item, target);
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
    hover(props, monitor, component) {
      const type = monitor.getItemType();
      const handler = hover[type];
      if (typeof(handler) === 'function') {
        handler(props, monitor, component);
      } else {
        console.warn(`No hover handler found for drag source type ${type}`);
      }
    },
  },
};

export const arePropsEqual = () => false;
