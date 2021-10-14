const express = require("express");
const authController = require("../controller/authController");
const { registerValidation } = require("../utils/validations");
const router = express.Router();

router.post("/register", registerValidation, authController.register);

module.exports = router;
