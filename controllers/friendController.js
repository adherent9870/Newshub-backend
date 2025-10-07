const Profiles = require("./../models/userModel");

//------------------------send Request-------------------------------------------------
exports.sendFriendRequest = async (req, res) => {
  const { requesterId } = req.body.requester;
  const { id: targetId } = req.body.target;

  if (requesterId === targetId)
    return res.status(400).json({ message: "You can't friend yourself 🙃" });

  const targetUser = await Profiles.findById(targetId);
  if (!targetUser) return res.status(404).json({ message: "User not found" });

  // prevent duplicates
  if (targetUser.friendRequests.includes(requesterId))
    return res.status(400).json({ message: "Request already sent" });

  if (targetUser.friends.includes(requesterId))
    return res.status(400).json({ message: "Already friends" });

  targetUser.friendRequests.push(requesterId);
  await targetUser.save({ validateBeforeSave: false });

  res.json({ message: "Friend request sent!" });
};
//------------------------accept Request-------------------------------------------------
exports.acceptFriendRequest = async (req, res) => {
  const { id, requesterId } = req.body;

  const user = await Profiles.findById(id);
  const requester = await Profiles.findById(requesterId);

  if (!user || !requester)
    return res.status(404).json({ message: "User not found" });

  if (!user.friendRequests.includes(requesterId))
    return res.status(400).json({ message: "No pending request" });

  // Add each other
  user.friends.push(requesterId);
  requester.friends.push(id);

  // Remove from pending list
  user.friendRequests = user.friendRequests.filter(
    (reqId) => reqId.toString() !== requesterId
  );

  await user.save();
  await requester.save();

  res.json({ message: "Friend request accepted!" });
};

//------------------------reject Request-------------------------------------------------
exports.rejectFriendRequest = async (req, res) => {
  const { id, requesterId } = req.body;
  const user = await Profiles.findById(id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.friendRequests = user.friendRequests.filter(
    (reqId) => reqId.toString() !== requesterId
  );

  await user.save();

  res.json({ message: "Friend request rejected!" });
};

//------------------------get Friendlist-------------------------------------------------
exports.getFriends = async (req, res) => {
  const { id } = req.params;
  const user = await Profiles.findById(id).populate("friends", "name email");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ friends: user.friends });
};
