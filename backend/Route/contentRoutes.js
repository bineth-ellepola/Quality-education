const express = require("express");
const router = express.Router();
const controller = require("../Controller/contentController");
const upload = require("../Config/uploadConfig");

router.post("/", upload.single("file"), controller.createContent);
router.get("/", controller.getAllContents);
router.get("/:id", controller.getContentById);
router.put("/:id", upload.single("file"), controller.updateContent);
router.delete("/:id", controller.deleteContent);

module.exports = router;
