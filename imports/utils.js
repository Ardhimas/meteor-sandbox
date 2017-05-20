export const isFriend = (friendIds = [], userId) => (
  friendIds.indexOf(userId) > -1
);
