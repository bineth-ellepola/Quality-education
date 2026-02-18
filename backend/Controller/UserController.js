const User = require("../Model/UserModel");

/* GET ALL USERS */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "role_name");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* GET SINGLE USER */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("role");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* UPDATE USER */
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* DELETE USER */
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
