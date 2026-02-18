const router = require("express").Router();
const userController = require("../Controller/UserController");

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", auth, userController.getAllUsers);
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, authorize("admin"), userController.deleteUser);

module.exports = router;
