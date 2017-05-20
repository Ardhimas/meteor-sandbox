import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Tasks = new Mongo.Collection('tasks');

export { Tasks as default };

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { receiverId: this.userId },
        { ownerId: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert': (text, receiverId) => {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      receiverId,
      createdAt: new Date(),
      ownerId: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove': (taskId) => {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.isPrivate && task.ownerId !== Meteor.userId()) {
      // If the task is isPrivate, make sure only the ownerId can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  'tasks.setChecked': (taskId, setChecked) => {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.isPrivate && task.ownerId !== Meteor.userId()) {
      // If the task is isPrivate, make sure only the ownerId can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { isChecked: setChecked } });
  },
  'tasks.setPrivate': (taskId, setToPrivate) => {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task ownerId can make a task isPrivate
    if (task.ownerId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { isPrivate: setToPrivate } });
  },
});
