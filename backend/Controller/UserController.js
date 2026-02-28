const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");


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

    //  Check if profile picture is provided
    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required"
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
      // Clean up uploaded file if user already exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    //  Upload profile picture to Cloudinary
    let profilePictureUrl = null;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "quality-education/profile-pictures",
        resource_type: "auto"
      });
      profilePictureUrl = result.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      // Clean up local file if upload fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({
        message: "Failed to upload profile picture"
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
      password,
      role,
      profilePicture: profilePictureUrl
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
        role: newUser.role,
        profilePicture: newUser.profilePicture
      }
    });

  } catch (error) {
    console.error(error);
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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

//login user
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