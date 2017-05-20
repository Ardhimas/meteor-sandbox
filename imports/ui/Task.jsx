import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class Task extends Component {
  constructor() {
    super();
    this.deleteThisTask = this.deleteThisTask.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
  }

  toggleChecked() {
    // Set the isChecked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.isChecked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }


  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.isPrivate);
  }

  render() {
    const { isChecked, isPrivate, username, text } = this.props.task;
    // Give tasks a different className when they are isChecked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
      checked: isChecked,
      private: isPrivate,
    });

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={isChecked}
          onClick={this.toggleChecked}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-isPrivate" onClick={this.togglePrivate}>
            { isPrivate ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          <strong>{username}</strong>: {text}
        </span>
      </li>
    );
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: PropTypes.bool.isRequired,
};
