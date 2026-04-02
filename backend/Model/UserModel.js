const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },

  last_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },

  role: {
    type: String,
    enum: ["ADMIN", "Student", "Instructor"],
    required: true
  },

  profilePicture: {
    type: String,
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

//Password Hashing 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return ;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (err) {
    throw err;
  }
});
// Compare password 
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
