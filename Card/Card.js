import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { DragSource as dSource, DropTarget as dTarget } from 'react-dnd';
import { dragSource, dropTarget } from './dnd';
import flow from 'lodash/flow';

class Card extends Component {

  static propTypes = {
    item: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    isDragging:  PropTypes.bool,
    updateWorkflow: PropTypes.func.isRequired,
    webhookCards: PropTypes.array
  }

  getCardName(id) {
    const { webhookCards } = this.props;
    const webhookCard = webhookCards.find(c => c.id === id);
    return webhookCard ? webhookCard.name : `Unknown #${id}`;
  }

  render() {
    const { connectDragSource, connectDropTarget, isDragging } = this.props;
    const { item } = this.props;
    const classNames = cx('card', { ['dragging']: isDragging }); // eslint-disable-line
    return connectDragSource(connectDropTarget(
      <li className={classNames}>
        <div className="inner">
          <span>{this.getCardName(item)}</span>
        </div>
      </li>
    ));
  }

}
export default flow([
  dSource('card', dragSource.spec, dragSource.collect),
  dTarget('card', dropTarget.spec, dropTarget.collect)
])(Card);
