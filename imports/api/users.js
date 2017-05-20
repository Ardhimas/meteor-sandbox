import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const Users = Meteor.users;

export { Users as default };

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish users that are not current user
  Meteor.publish('users', () =>
    Meteor.users.find({}),
  );
}

Meteor.methods({
  'users.addFriend': (friendId) => {
    const userId = Meteor.userId();
    // Make sure the user is logged in before adding a friend
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }
    check(userId, String);
    check(friendId, String);
    Users.upsert(userId, {
      $addToSet: {
        friendIds: friendId,
      },
    });
  },
  'users.removeFriend': (friendId) => {
    const userId = Meteor.userId();
    check(userId, String);
    check(friendId, String);
    // Make sure the user is logged in before adding a friend
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }
    Users.upsert(userId, {
      $pull: {
        friendIds: friendId,
      },
    });
  },
  'users.setChecked': (userId, setChecked) => {
    check(userId, String);
    check(setChecked, Boolean);

    const user = Users.findOne(userId);
    if (user.isPrivate && user.owner !== Meteor.userId()) {
      // If the user is isPrivate, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Users.update(userId, { $set: { isChecked: setChecked } });
  },
  'users.setPrivate': (userId, setToPrivate) => {
    check(userId, String);
    check(setToPrivate, Boolean);

    const user = Users.findOne(userId);

    // Make sure only the user owner can make a user isPrivate
    if (user.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Users.update(userId, { $set: { isPrivate: setToPrivate } });
  },
});
