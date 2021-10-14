const { check, validationResult } = require("express-validator");

exports.registerValidation = [
  check("name", "Name is not empty").trim().not().isEmpty(),
  check("email", "Email is invalid").isEmail(),
  check("password", "Passwords must be at least 6 characters").isLength({
    min: 6,
  }),
];
