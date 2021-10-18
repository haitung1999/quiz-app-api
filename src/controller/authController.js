const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const { handleError } = require("../utils/handleError");

class AuthController {
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: "User already registered", success: false });
      }

      // Create salt & hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
      };

      const result = await User.create(newUser);

      const payload = {
        id: result.id,
        name: result.name,
        email: result.email,
      };

      //generate token
      const tokenSign = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRE_TIME,
      });

      return res.status(200).json({
        user: { name, email, role },
        token: "Bearer " + tokenSign,
        success: true,
      });
    } catch (e) {
      return handleError(res, e, "Cannot register new user.");
    }
  }

  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        //generate token
        const tokenSign = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.EXPIRE_TIME,
        });

        return res.status(200).json({
          token: "Bearer " + tokenSign,
          success: true,
        });
      }
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    } catch (e) {
      return handleError(res, e, "Cannot login user.");
    }
  }
}

module.exports = new AuthController();
