import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Card, Button, Row, Col } from 'react-materialize';

import Users from '../api/users';

import MessagesPanel from './MessagesPanel.jsx';
import User from './User.jsx';

import { filterFriends, filterNotFriends } from '../utils.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      receiver: null,
      selectedTab: 'Friends',
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  handleChangeTab(newTab) {
    this.setState({ selectedTab: newTab });
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
    const isChatting = !!this.state.receiver;
    const { _id, username } = isChatting && this.state.receiver;
    const isAddingFriends = this.state.selectedTab === 'Add Friends';
    return (
      <Row className="container">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <Col s={12} m={6} offset={currentUser ? 'm1' : 'm3'}>
          <MessagesPanel
            receiverId={_id}
            receiverName={username}
            isChatting={isChatting}
          />
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
  currentUser: PropTypes.object,
  allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('users');
  return {
    currentUser: Meteor.user(),
    allUsers: Users.find({}).fetch(),
  };
}, App);
