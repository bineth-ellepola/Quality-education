import express from "express";
import * as UserController from "../Controllers/UserController.js";

const router = express.Router();

// Create user
router.post("/", UserController.createUser);

 
router.get("/:id", UserController.getUserById); 
router.post("/signin", UserController.signInUser);

export default router;
