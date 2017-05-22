import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Card, Button } from 'react-materialize';

import Users from '../api/users';

import User from './User.jsx';

import { filterFriends, filterNotFriends } from '../utils.js';

// UsersPanel component - represents the whole UsersPanel
class UsersPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Friends',
    };
    this.setSelectedTab = this.setSelectedTab.bind(this);
  }

  setSelectedTab(event) {
    event.preventDefault();
    const selectedTab = this.state.selectedTab === 'Friends' ? 'Add Friends' : 'Friends';
    this.setState({ selectedTab });
  }

  renderUsers() {
    const { allUsers, currentUser, setReceiver } = this.props;
    if (currentUser) {
      if (this.state.selectedTab === 'Friends') {
        const friendUsers = filterFriends(currentUser.friendIds, allUsers);
        return friendUsers.map(user => (
          <User
            key={user._id}
            user={user}
            setReceiver={setReceiver}
            isFriend
          />
        ));
      } else if (this.state.selectedTab === 'Add Friends') {
        const friendUsers = filterNotFriends(currentUser.friendIds, allUsers);
        return friendUsers.map(user => (
          <User
            key={user._id}
            user={user}
            setReceiver={setReceiver}
            isFriend={false}
          />
        ));
      }
    }
    return <noscript />;
  }

  render() {
    const { currentUser } = this.props;
    const { selectedTab } = this.state;
    const isAddingFriends = selectedTab === 'Add Friends';
    return (
      currentUser &&
        <Card id="users-panel" className="panel">
          <header>
            <h1>{selectedTab}</h1>
            <Button
              floating
              className="btn-navigation"
              icon={isAddingFriends ? 'chevron_left' : 'add'}
              onClick={this.setSelectedTab}
            />
          </header>
          <ul className="list">
            {this.renderUsers()}
          </ul>
        </Card>
    );
  }
}

UsersPanel.defaultProps = {
  currentUser: null,
};

UsersPanel.propTypes = {
  currentUser: PropTypes.object,
  allUsers: PropTypes.array.isRequired,
  setReceiver: PropTypes.func.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('users');
  return {
    currentUser: Meteor.user(),
    allUsers: Users.find({}).fetch(),
  };
}, UsersPanel);
