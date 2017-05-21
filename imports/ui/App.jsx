import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Row, Col } from 'react-materialize';

import MessagesPanel from './MessagesPanel.jsx';
import FriendsPanel from './FriendsPanel.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: null,
    };
  }

  render() {
    const { currentUser } = this.props;
    const isChatting = !!this.state.receiver;
    const { _id, username } = isChatting && this.state.receiver;
    return (
      <Row className="container">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <Col s={12} m={6} offset={currentUser ? 'm1' : 'm3'}>
          <MessagesPanel
            receiverId={_id}
            receiverName={username}
            isChatting={isChatting}
          />
        </Col>
        <Col s={12} m={4}>
          <FriendsPanel
            setReceiver={receiver => this.setState({ receiver })}
          />
        </Col>
        <footer>Made with ❤ by Ardhimas</footer>
      </Row>
    );
  }
}

App.defaultProps = {
  currentUser: null,
};

App.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('users');
  return {
    currentUser: Meteor.user(),
  };
}, App);
