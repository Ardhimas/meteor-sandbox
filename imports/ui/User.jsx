import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Button } from 'react-materialize';

// User component - represents a single todo item
export default class User extends Component {
  constructor() {
    super();
    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.handleStartChat = this.handleStartChat.bind(this);
  }

  addFriend() {
    Meteor.call('users.addFriend', this.props.user._id);
  }

  removeFriend() {
    Meteor.call('users.removeFriend', this.props.user._id);
  }

  handleStartChat() {
    this.props.setReceiverId();
  }

  render() {
    const { username } = this.props.user;
    const { isFriend } = this.props;
    const userClassName = classnames({
      friend: isFriend,
    });

    return (
      <li className={userClassName}>
        <Button
          floating
          onClick={this.props.setReceiverId}
          icon="chat"
        />
        <Button
          floating
          className="list-action"
          onClick={isFriend ? this.removeFriend : this.addFriend}
          icon={isFriend ? 'close' : 'add'}
        />
        <span className="text">
          {username}
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
