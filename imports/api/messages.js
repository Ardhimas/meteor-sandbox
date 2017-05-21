import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Messages = new Mongo.Collection('messages');

export { Messages as default };

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish messages that are public or belong to the current user
  Meteor.publish('messages', function messagesPublication() {
    return Messages.find({
      $or: [
        { receiverId: this.userId },
        { ownerId: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'messages.insert': (text, receiverId) => {
    check(text, String);

    // Make sure the user is logged in before inserting a message
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.insert({
      text,
      receiverId,
      createdAt: new Date(),
      ownerId: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'messages.remove': (messageId) => {
    check(messageId, String);

    const message = Messages.findOne(messageId);
    if (message.isPrivate && message.ownerId !== Meteor.userId()) {
      // If the message is isPrivate, make sure only the ownerId can delete it
      throw new Meteor.Error('not-authorized');
    }

    Messages.remove(messageId);
  },
  'messages.setSeen': (messageId, setChecked) => {
    check(messageId, String);
    check(setChecked, Boolean);

    const message = Messages.findOne(messageId);
    if (message.isPrivate && message.ownerId !== Meteor.userId()) {
      // If the message is isPrivate, make sure only the ownerId can check it off
      throw new Meteor.Error('not-authorized');
    }

    Messages.update(messageId, { $set: { isChecked: setChecked } });
  },
});
