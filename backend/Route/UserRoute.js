const router = require("express").Router();
const userController = require("../Controller/UserController");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", upload.single("profilePicture"), userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/",  userController.getAllUsers);
router.get("/:id",  userController.getUserById);
router.put("/:id",  userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
