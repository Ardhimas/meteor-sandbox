import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Card, Button, Row, Col } from 'react-materialize';

import Messages from '../api/messages.js';
import Users from '../api/users';

import Message from './Message.jsx';
import User from './User.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import { filterFriends, filterNotFriends, filterActiveMessages } from '../utils.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      receiver: null,
      selectedTab: 'Friends',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.textInput.value.trim();

    Meteor.call('messages.insert', text, this.state.receiver._id);

    // Clear form
    this.textInput.value = '';
  }

  handleChangeTab(newTab) {
    this.setState({ selectedTab: newTab });
  }

  renderMessages() {
    if (this.state.receiver) {
      const filteredMessages = filterActiveMessages(this.props.messages, this.state.receiver._id);
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
    return (
      <noscript />
    );
  }

  renderUsers() {
    const { allUsers, currentUser } = this.props;
    if (currentUser) {
      if (this.state.selectedTab === 'Friends') {
        const friendUsers = filterFriends(currentUser.friendIds, allUsers);
        return friendUsers.map(user => (
          <User
            key={user._id}
            user={user}
            setReceiverId={() => this.setState({ receiver: user })}
            isFriend
          />
        ));
      } else if (this.state.selectedTab === 'Add Friends') {
        const friendUsers = filterNotFriends(currentUser.friendIds, allUsers);
        return friendUsers.map(user => (
          <User
            key={user._id}
            user={user}
            setReceiverId={() => this.setState({ receiver: user })}
            isFriend={false}
          />
        ));
      }
    }
    return <noscript />;
  }

  render() {
    const { currentUser } = this.props;
    const isChatting = this.state.receiver;
    const receiverName = isChatting && this.state.receiver.username;
    const isAddingFriends = this.state.selectedTab === 'Add Friends';
    return (
      <Row className="container">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <Col s={12} m={6} offset={currentUser ? 'm1' : 'm3'}>
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
              <form className="new-message" onSubmit={this.handleSubmit} >
                <input
                  type="text"
                  disabled={!isChatting}
                  ref={(c) => { this.textInput = c; }}
                  placeholder={isChatting ? `Send message to ${receiverName}` : 'Select a user to begin chatting'}
                />
              </form>
            }
          </Card>
        </Col>
        <Col s={12} m={4}>
          { currentUser &&
            <Card id="" className="panel">
              <header>
                <h1>{this.state.selectedTab}</h1>
                <Button
                  floating
                  className="btn-navigation"
                  icon={isAddingFriends ? 'chevron_left' : 'add'}
                  onClick={() => this.setState({ selectedTab: (isAddingFriends ? 'Friends' : 'Add Friends') })}
                >
                  Add Friends
                </Button>
              </header>
              <ul className="list">
                {this.renderUsers()}
              </ul>
            </Card>
          }
        </Col>
        <footer>Made with ❤ by Ardhimas</footer>
      </Row>
    );
  }
}

App.defaultProps = {
  currentUser: null,
};

App.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('messages');
  Meteor.subscribe('users');
  return {
    messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
    unreadCount: Messages.find({ isChecked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
    allUsers: Users.find({}).fetch(),
  };
}, App);
