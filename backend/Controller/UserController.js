const User = require("../models/User");
const bcrypt = require("bcryptjs");




// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role
    } = req.body;

    //  Check required fields
    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    //  Prevent admin self-registration (SECURITY)
    if (role === "ADMIN") {
      return res.status(403).json({
        message: "You cannot register as ADMIN"
      });
    }

    //  Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    //  Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};