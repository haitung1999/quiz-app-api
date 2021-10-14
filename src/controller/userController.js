const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

class UserController {
  getAll(req, res) {
    res.send("abc");
  }
}

module.exports = new UserController();
