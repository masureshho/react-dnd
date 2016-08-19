import React, { Component, PropTypes } from 'react';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List/List';
import update from 'react/lib/update';


import { Button } from 'cf-component-button';

class WorkflowView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: props.webhookFlows
    };
    this.addFlow = this.addFlow.bind(this);
    this.addCard = this.addCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.updateWorkflow = this.updateWorkflow.bind(this);
  }

  addFlow() {
    const { actions } = this.props;
    actions.webhookFlowCreate();
  }

  addCard() {
    const { actions } = this.props;
    actions.webhookCardCreate();
  }
  updateWorkflow() {
    const { actions, webhook } = this.props;
    actions.workflowUpdate(webhook.id, this.state.lists)
    .then(() => {});
  }
  moveCard(item, target) {
    const dragItem = this.state.lists[item.list].cardIds[item.index];
    const remove = { lists: {} };
    const insert = { lists: {} };
    remove.lists[item.list] = { cardIds: { $splice: [[item.index, 1]] } };
    insert.lists[target.list] = { cardIds: { $splice: [[target.index, 0, dragItem]] } };
    this.setState(update(update(this.state, remove), insert));
    item.index = target.index; // eslint-disable-line
    item.list = target.list; // eslint-disable-line
  }

  moveList(list, target) {
    const dragItem = this.state.lists[list.index];
    this.setState(update(this.state, {
      lists: {
        $splice: [
          [list.index, 1],
          [target.index, 0, dragItem],
        ],
      },
    }));
    list.index = target.index; // eslint-disable-line
  }

  render() {
    const { lists } = this.state;
    return (
      <div className="workflow">
        <div className="toolbar">
          <Button type="primary" onClick={this.addFlow}>
            Add Flow
          </Button>
          <Button type="primary" onClick={this.addCard}>
            Add Card
          </Button>
        </div>
        <div>
          <div className="list-container">
            {lists.map((list, index) => (
              <List
                index={index}
                lists={list.cardIds}
                moveList={this.moveList}
                moveCard={this.moveCard}
                key={list.id}
                webhookCards={this.props.webhookCards}
                listId={list.id}
                name={list.name}
                updateWorkflow={this.updateWorkflow}
              />
          ))}
          </div>
        </div>
      </div>
    );
  }
}

WorkflowView.propTypes = {
  actions:        PropTypes.object.isRequired,
  webhook:        PropTypes.object.isRequired,
  webhookFlows:   PropTypes.array.isRequired,
  webhookCards:   PropTypes.array.isRequired
};

export default dragDropContext(HTML5Backend)(WorkflowView);
