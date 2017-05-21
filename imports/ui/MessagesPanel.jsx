import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Card } from 'react-materialize';

import Messages from '../api/messages.js';

import Message from './Message.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import { filterActiveMessages } from '../utils.js';

// MessagesPanel component - represents the whole app
class MessagesPanel extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = this.textInput.value.trim();

    Meteor.call('messages.insert', text, this.props.receiverId);

    // Clear form
    this.textInput.value = '';
  }

  renderMessages() {
    if (this.props.isChatting) {
      const filteredMessages = filterActiveMessages(this.props.messages, this.props.receiverId);
      return filteredMessages.map((message) => {
        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const showPrivateButton = message.ownerId === currentUserId;

        return (
          <Message
            key={message._id}
            message={message}
            position={showPrivateButton ? 'left' : 'right'}
          />
        );
      });
    }
    return <noscript />;
  }

  render() {
    const { currentUser, receiverName, isChatting } = this.props;
    return (
      <Card id="message-panel" textClassName="message-list" className="panel large">
        <header>
          <h1>Meteor Chat {isChatting ? `with ${receiverName}` : ''}</h1>
          <AccountsUIWrapper currentUser={currentUser} />
        </header>
        <ul className="list">
          {!currentUser && <span id="sign-in">Sign in to Chat</span>}
          {this.renderMessages()}
        </ul>

        { currentUser &&
          <form onSubmit={this.handleSubmit} >
            <input
              type="text"
              disabled={!isChatting}
              ref={(c) => { this.textInput = c; }}
              placeholder={isChatting ? `Send message to ${receiverName}` : 'Select a user to begin chatting'}
            />
          </form>
        }
      </Card>
    );
  }
}

MessagesPanel.defaultProps = {
  currentUser: null,
  receiverName: '',
  receiverId: '',
};

MessagesPanel.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  receiverName: PropTypes.string,
  receiverId: PropTypes.string,
  isChatting: PropTypes.bool.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('messages');
  Meteor.subscribe('users');
  return {
    messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
    unreadCount: Messages.find({ isChecked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, MessagesPanel);
