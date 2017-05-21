const isFriend = (friendIds = [], userId) => (
  friendIds.indexOf(userId) > -1
);

export const filterFriends = (friendIds = [], allUsers) => (
  allUsers.filter(user => isFriend(friendIds, user._id))
);

export const filterNotFriends = (friendIds = [], allUsers) => (
  allUsers.filter(user => !isFriend(friendIds, user._id))
);

export const filterActiveTasks = (tasks, receiverId) => (
  tasks.filter(task => (task.ownerId === receiverId || task.receiverId === receiverId))
);
