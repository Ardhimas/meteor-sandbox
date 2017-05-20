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
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.textInput.value.trim();

    Meteor.call('tasks.insert', text);

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
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    const { incompleteCount, currentUser, allUsers } = this.props;
    const userList = allUsers.map(user => (
      <User
        key={user._id}
        user={user}
        isFriend={isFriend(currentUser.friendIds, user._id)}
      />
    ));
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
                ref={(c) => { this.textInput = c; }}
                placeholder="Send message to"
              />
            </form> : ''
          }
        </div>
        <div className="panel">
          {userList}
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
