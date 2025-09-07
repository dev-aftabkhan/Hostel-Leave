const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const parentController = require("../controller/parentControllers");

router.post("/login", parentController.loginParent);
router.get("/profile", authMiddleware, parentController.getParentById);

module.exports = router;