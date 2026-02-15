// Models/UserModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["instructor", "student", "admin"], default: "instructor" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
