import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Card from '../Card/Card';
import { DragSource as dSource, DropTarget as dTarget } from 'react-dnd';
import { dragSource, dropTarget, arePropsEqual } from './dnd';
import flow from 'lodash/flow';

class List extends Component {

  static propTypes = {
    lists: PropTypes.array.isRequired,
    moveList: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    updateWorkflow: PropTypes.func.isRequired,
    webhookCards: PropTypes.array,
    name: PropTypes.string.isRequired,
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    connectDragPreview: PropTypes.func,
    isDragging: PropTypes.bool,
    index: PropTypes.number
  }
  renderList() {
    const  items  = this.props.lists;
    return (
      <ul>
        {items.map((item, index) => (
          <Card
            key={`card-${item}-${index}`}
            item={item}
            index={index}
            list={this.props.index}
            moveCard={this.props.moveCard}
            webhookCards={this.props.webhookCards}
            updateWorkflow={this.props.updateWorkflow}
          />
        ))}
      </ul>
    );
  }

  renderEmpty() {
    return (
      <div className="target">
        <span>Drop items here</span>
      </div>
    );
  }

  render() {
    const { lists, name, connectDragSource, connectDropTarget, connectDragPreview, isDragging } = this.props;
    const length  = lists.length;
    const className = cx('list', { ['empty']: length === 0, ['dragging']: isDragging }); // eslint-disable-line
    return connectDragPreview(connectDropTarget(
      <div className={className}>
        <header className="header">
          {connectDragSource(<h3> {name} ({lists.length})</h3>)}
        </header>
        {length ? this.renderList() : this.renderEmpty()}
      </div>
    ));
  }
}

export default flow([
  dSource('list', dragSource.spec, dragSource.collect, { arePropsEqual }),
  dTarget(['card', 'list'], dropTarget.spec, dropTarget.collect, { arePropsEqual })
])(List);
