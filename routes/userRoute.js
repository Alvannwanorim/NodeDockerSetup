const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/sign-up").post(userController.signUp);
router.route("/login").post(userController.login);

module.exports = router;
