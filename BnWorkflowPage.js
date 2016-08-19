import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import DocumentTitle from 'react-document-title';

import { Page, PageHeader } from 'cf-component-page';
import {
  CardMessages
} from 'cf-component-card';

import * as UrlPaths from '../../constants/UrlPaths';
import * as WebhookCard from '../../reducers/webhookCardReducer';
import * as WebhookFlow from '../../reducers/webhookFlowReducer';

import WorkflowView from './workflowView';

class BotWorkflowPage extends Component {

  static reduxAsyncConnect = [{
    promise: ({ params, store: { dispatch, getState } }) => {
      const promises = [];
      if (!WebhookFlow.isLoaded(getState())) {
        promises.push(dispatch(WebhookFlow.load(params.botname)));
      }
      if (!WebhookCard.isLoaded(getState())) {
        promises.push(dispatch(WebhookCard.load(params.botname)));
      }
      return Promise.all(promises);
    }
  }];

  state = {
    activeDrawer: null
  };

  handleDrawerClick = id => {
    this.setState({
      activeDrawer: id === this.state.activeDrawer ? null : id
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { actions, params: { botname } } = this.props;

    actions
      .publishWebhook(botname)
      .then(webhook => {
        actions.pushState(
          UrlPaths.BOT_OVERVIEW_PAGE.replace(/:botname/g, webhook.internalName)
        );
      })
      .catch(() => ({}));
  }

  render() {
    const { webhook, loadError, updateError, webhookFlowsupdateError } = this.props;
    const messages = [];
    if (loadError) { messages.push({ type: 'error', content: loadError }); }
    if (updateError) { messages.push({ type: 'error', content: updateError }); }
    if (webhookFlowsupdateError) { messages.push({ type: 'error', content: webhookFlowsupdateError }); }

    return (
      <div className="bot-workflow-container container">
        <DocumentTitle title={`${webhook.name} Workflow`} />
        <Page>
          <PageHeader
            title="Workflow"
          />
          <div className="bot-workflow-content page-content">
            <CardMessages messages={messages} />
            <WorkflowView {...this.props} />
          </div>
        </Page>
      </div>
    );
  }
}

BotWorkflowPage.propTypes = {
  loadError:                PropTypes.string,
  updateError:              PropTypes.string,
  webhookFlowsupdateError:  PropTypes.string,
  webhook:                  PropTypes.object.isRequired,
  webhookCards:             PropTypes.array.isRequired,
  webhookFlows:             PropTypes.array.isRequired,
  params:                   PropTypes.object.isRequired,
  actions:                  PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    webhook:                  state.webhooks.data.find(w => w.internalName === ownProps.params.botname),
    webhookCards:             state.webhookCards.data,
    webhookFlows:             state.webhookFlows.data,
    webhookFlowsupdateError:  state.webhookFlows.updateError,
    loadError:                state.webhooks.loadError,
    updateError:              state.webhooks.updateError
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      pushState:          routeActions.push,
      webhookFlowCreate:  WebhookFlow.create,
      webhookCardCreate:  WebhookCard.create,
      workflowUpdate: WebhookFlow.update
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BotWorkflowPage);
