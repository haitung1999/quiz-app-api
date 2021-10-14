const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const { handleError } = require("../utils/handleError");

class AuthController {
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
        expiresIn: parseInt(process.env.EXPIRE_TIME),
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
}

module.exports = new AuthController();
