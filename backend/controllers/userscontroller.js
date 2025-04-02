import User from "../models/user.js";

export const users = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const additionaluserinfo = async (req, res) => {
  try {
    const { address, name, email } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    const existingUser = await User.findOne({ address });

    if (existingUser) {
      const updatedUser = await User.findOneAndUpdate(
        { address },
        { $set: { name, email } },
        { new: true, upsert: true }
      );

      return res.status(200).json({ success: true, user: updatedUser });
    }
  } catch (error) {
    console.error("Error saving/updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error upgrading user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
