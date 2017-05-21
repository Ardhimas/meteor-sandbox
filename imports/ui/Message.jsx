import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

export default class Message extends Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSeen = this.handleSeen.bind(this);
  }

  handleSeen() {
    // TODO: implement read receipts
    Meteor.call('messages.setSeen', this.props.message._id, !this.props.message.isChecked);
  }

  handleDelete() {
    Meteor.call('messages.remove', this.props.message._id);
  }

  render() {
    const { text } = this.props.message;
    const { position } = this.props;
    return (
      <li className={position}>
        <span>
          {text}
        </span>
      </li>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
};
