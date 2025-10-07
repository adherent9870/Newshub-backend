const Profiles = require("../models/userModel");

exports.getAllUsersExceptRequester = async (req, res) => {
  try {
    const { id } = req.params; // requester’s ID

    // Confirm requester exists
    const requester = await Profiles.findById(id);
    if (!requester)
      return res.status(404).json({ message: "Requester not found" });

    // Find everyone except requester
    const users = await Profiles.find({ _id: { $ne: id } }).select(
      "name email "
    );

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong fetching users",
      error: err.message,
    });
  }
};
