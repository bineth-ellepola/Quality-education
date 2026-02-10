const express = require("express");
const router = express.Router();
const controller = require("../Controller/contentController");

router.post("/", controller.createContent);
router.get("/", controller.getAllContents);
router.get("/:id", controller.getContentById);
router.put("/:id", controller.updateContent);
router.delete("/:id", controller.deleteContent);

module.exports = router;
