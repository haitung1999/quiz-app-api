const { check, body } = require("express-validator");
const User = require("../models/User");

exports.registerValidation = [
  check("name", "Name is not empty").trim().not().isEmpty(),
  check("email", "Email is invalid").isEmail(),
  check("password", "Passwords must be at least 6 characters").isLength({
    min: 6,
  }),
];

exports.loginValidation = [
  check("email", "Email is invalid").isEmail(),
  check("password", "Passwords can not be empty").trim().not().isEmpty(),
];
