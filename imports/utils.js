const isFriend = (friendIds = [], userId) => (
  friendIds.indexOf(userId) > -1
);

export const filterFriends = (friendIds = [], allUsers) => (
  allUsers.filter(user => isFriend(friendIds, user._id))
);

export const filterNotFriends = (friendIds = [], allUsers) => (
  allUsers.filter(user => !isFriend(friendIds, user._id))
);

export const filterActiveMessages = (messages, receiverId) => (
  messages.filter(message => (message.ownerId === receiverId || message.receiverId === receiverId))
);
