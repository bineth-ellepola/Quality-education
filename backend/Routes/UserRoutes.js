const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController.js");

// Create user
router.post("/", UserController.createUser);

// Get all users
router.get("/", UserController.getUsers);

module.exports = router;
