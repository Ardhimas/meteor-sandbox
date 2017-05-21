/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';


import { Messages } from './messages.js';

if (Meteor.isServer) {
  describe('Messages', () => {
    describe('methods', () => {
      const userId = Random.id();
      let messageId;

      beforeEach(() => {
        Messages.remove({});
        messageId = Messages.insert({
          text: 'test message',
          createdAt: new Date(),
          ownerId: userId,
          username: 'tmeasday',
        });
      });

      it('can delete owned message', () => {
        // Find the internal implementation of the message method so we can
        // test it in isolation
        const deleteMessage = Meteor.server.method_handlers['messages.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteMessage.apply(invocation, [messageId]);

        // Verify that the method does what we expected
        assert.equal(Messages.find().count(), 0);
      });
    });
  });
}
