import express from "express";
import * as UserController from "../Controllers/UserController.js";

const router = express.Router();

// Create user
router.post("/", UserController.createUser);

// Get all users
router.get("/", UserController.getUsers);

export default router;
