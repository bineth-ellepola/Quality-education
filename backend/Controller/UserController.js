const User = require("../Model/UserModel");
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

//get all uders 
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

//get by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


//Update users
exports.updateUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, isActive } = req.body;

    const updateData = {
      first_name,
      last_name,
      email,
      role,
      isActive
    };

    // If password updated → hash again
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


//Delete Users 
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};