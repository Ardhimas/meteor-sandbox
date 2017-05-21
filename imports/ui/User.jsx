import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Button } from 'react-materialize';

export default class User extends Component {
  constructor() {
    super();
    this.setReceiver = this.setReceiver.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
  }

  setReceiver(event) {
    event.preventDefault();
    this.props.setReceiver(this.props.user);
  }

  addFriend() {
    Meteor.call('users.addFriend', this.props.user._id);
  }

  removeFriend() {
    Meteor.call('users.removeFriend', this.props.user._id);
  }

  render() {
    const { isFriend, user: { username } } = this.props;
    const userClassName = classnames({
      friend: isFriend,
    });

    return (
      <li className={userClassName}>
        <Button
          floating
          onClick={this.setReceiver}
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
  user: PropTypes.object.isRequired,
  isFriend: PropTypes.bool.isRequired,
  setReceiver: PropTypes.func.isRequired,
};
