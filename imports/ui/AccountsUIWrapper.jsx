import React, { Component } from 'react';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

class AccountsUIWrapper extends Component {
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons,
      this.container);
  }
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  }
  render() {
    // Just render a placeholder container that will be filled in
    const { currentUser } = this.props;
    return (
      <div id="login-info">
        {currentUser && <span>Signed in as </span>}
        <span ref={(c) => { this.container = c; }} />
      </div>
    );
  }
}

AccountsUIWrapper.defaultProps = {
  currentUser: null,
};

AccountsUIWrapper.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('messages');
  // console.log('Meteor.user()', Meteor.user());

  return {
    currentUser: Meteor.user(),
  };
}, AccountsUIWrapper);
