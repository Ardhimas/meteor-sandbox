import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Tasks from '../api/tasks.js';
import Users from '../api/users';

import Task from './Task.jsx';
import User from './User.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import { isFriend } from '../utils.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      receiver: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.textInput.value.trim();

    Meteor.call('tasks.insert', text, this.state.receiver._id);

    // Clear form
    this.textInput.value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.isChecked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.ownerId === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  renderUsers() {
    const { allUsers, currentUser } = this.props;
    return allUsers.map(user => (
      <User
        key={user._id}
        user={user}
        setReceiverId={() => this.setState({ receiver: user })}
        isFriend={isFriend(currentUser.friendIds, user._id)}
      />
    ));
  }

  render() {
    const { incompleteCount, currentUser } = this.props;
    const isChatting = this.state.receiver;
    return (
      <div className="container">
        <div className="panel">
          <header>
            <h1>Meteor Chat {incompleteCount}</h1>

            <AccountsUIWrapper currentUser={currentUser} />

          </header>
          <ul>
            {this.renderTasks()}
          </ul>

          { currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit} >
              <input
                type="text"
                disabled={!isChatting}
                ref={(c) => { this.textInput = c; }}
                placeholder={isChatting ? 'Send message to ' + this.state.receiver.username : 'Select a user to begin chatting'}
              />
            </form> : ''
          }
        </div>
        <div className="panel">
          {this.renderUsers()}
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  currentUser: null,
};

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
  allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('users');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ isChecked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
    allUsers: Users.find({}).fetch(),
  };
}, App);
