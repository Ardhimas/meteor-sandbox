import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// User component - represents a single todo item
export default class User extends Component {
  constructor() {
    super();
    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.handleStartChat = this.handleStartChat.bind(this);
  }
  toggleChecked() {
    // Set the isChecked property to the opposite of its current value
    Meteor.call('users.setChecked', this.props.user._id, !this.props.user.isChecked);
  }

  addFriend() {
    Meteor.call('users.addFriend', this.props.user._id);
  }

  removeFriend() {
    Meteor.call('users.removeFriend', this.props.user._id);
  }

  togglePrivate() {
    Meteor.call('users.setPrivate', this.props.user._id, !this.props.user.isPrivate);
  }

  handleStartChat() {
    this.props.setReceiverId();
  }

  render() {
    const { username } = this.props.user;
    const { isFriend } = this.props;
    // Give users a different className when they are isChecked off,
    // so that we can style them nicely in CSS
    const userClassName = classnames({
      friend: isFriend,
    });

    return (
      <li className={userClassName}>
        <button className="toggle-isPrivate" onClick={this.props.setReceiverId}>
          Chat
        </button>
        <button className="delete" onClick={isFriend ? this.removeFriend : this.addFriend}>
          {isFriend ? '×' : '+'}
        </button>
        <span className="text">
          <strong>{username}</strong>
        </span>
      </li>
    );
  }
}

User.propTypes = {
  // This component gets the user to display through a React prop.
  // We can use propTypes to indicate it is required
  user: PropTypes.object.isRequired,
  isFriend: PropTypes.bool.isRequired,
  setReceiverId: PropTypes.func.isRequired,
};
