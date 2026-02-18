const User = require("../Model/UserModel");
const Role = require("../Model/RoleModel");
const Student = require("../Model/Student");
const Instructor = require("../Model/Instructor");
const jwt = require("jsonwebtoken");

//register 
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role_name } = req.body;

    const role = await Role.findOne({ role_name });
    if (!role) return res.status(400).json({ message: "Invalid role" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      role: role._id
    });

    /* Create Student / Instructor automatically */
    if (role_name === "student") {
      await Student.create({
        user: user._id,
        registrationNumber: "REG" + Date.now()
      });
    }

    if (role_name === "instructor") {
      await Instructor.create({
        user: user._id,
        employeeId: "EMP" + Date.now()
      });
    }

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .populate("role");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.first_name,
        role: user.role.role_name
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
