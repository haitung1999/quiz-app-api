const express = require("express");
const authController = require("../controller/authController");
const { registerValidation, loginValidation } = require("../utils/validations");

const router = express.Router();

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

module.exports = router;
