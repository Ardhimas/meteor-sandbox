import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// User component - represents a single todo item
export default class User extends Component {
  constructor() {
    super();
    this.addFriend = this.addFriend.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
  }
  toggleChecked() {
    // Set the isChecked property to the opposite of its current value
    Meteor.call('users.setChecked', this.props.user._id, !this.props.user.isChecked);
  }

  addFriend() {
    Meteor.call('users.addFriend', this.props.currentUserId, this.props.user._id);
  }


  togglePrivate() {
    Meteor.call('users.setPrivate', this.props.user._id, !this.props.user.isPrivate);
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
        <button className="delete" onClick={this.addFriend}>
          &#43;
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
  currentUserId: PropTypes.string.isRequired,
  isFriend: PropTypes.bool.isRequired,
};
