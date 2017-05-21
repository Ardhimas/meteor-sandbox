import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

// Message component - represents a single todo item
export default class Message extends Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSeen = this.handleSeen.bind(this);
  }

  handleSeen() {
    // Set the isChecked property to the opposite of its current value
    Meteor.call('messages.setSeen', this.props.message._id, !this.props.message.isChecked);
  }

  handleDelete() {
    Meteor.call('messages.remove', this.props.message._id);
  }

  render() {
    const { text } = this.props.message;
    const { position } = this.props;
    // Give messages a different className when they are isChecked off,
    // so that we can style them nicely in CSS
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
  // This component gets the message to display through a React prop.
  // We can use propTypes to indicate it is required
  message: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
};
