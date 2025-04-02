import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  address: String,
  name: String,
  email: String,
  token: String,
  role: {
    type: String,
    enum: ["Verified", "Premium", "Admin"],
    default: "Admin",
  },
  vc: { type: mongoose.Schema.Types.Mixed },
});

const User = mongoose.model("User", userSchema);

export default User;
