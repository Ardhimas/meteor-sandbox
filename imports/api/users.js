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
  'users.find': (text, receiverId) => {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Users.insert({
      text,
      receiverId,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'users.remove': (taskId) => {
    check(taskId, String);

    const task = Users.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Users.remove(taskId);
  },
  'users.setChecked': (taskId, setChecked) => {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Users.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Users.update(taskId, { $set: { checked: setChecked } });
  },
  'users.setPrivate': (taskId, setToPrivate) => {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Users.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Users.update(taskId, { $set: { private: setToPrivate } });
  },
});
