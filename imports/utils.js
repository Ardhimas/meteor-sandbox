export const isFriend = (friendIds = [], userId) => (
  friendIds.indexOf(userId) > -1
);

export const filterActiveTasks = (tasks, receiverId) => (
  tasks.filter(task => (task.ownerId === receiverId || task.receiverId === receiverId))
);
