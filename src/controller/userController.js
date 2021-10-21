const User = require("../models/User");
const { handleError } = require("../utils/handleError");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../../.env") });
const jwt = require("jsonwebtoken");

class UserController {
  async getAll(req, res) {
    try {
      const user = await User.find()
        .select("-password")
        .sort({ createdAt: "desc" });
      if (user) {
        return res.status(200).json({ data: user, success: true });
      }
    } catch (error) {
      return handleError(res, error, "Cannot get users");
    }
  }

  async getCurrent(req, res) {
    try {
      const user_id = req.params.user_id;
      const user = await User.findById(user_id).select("-password").exec();

      if (user) {
        return res.status(200).json({ data: user, success: true });
      }

      res.status(404).json({ message: "User not found!", success: false });
    } catch (error) {
      return handleError(res, error, "Cannot get user");
    }
  }

  async changeInfo(req, res) {
    const updateUser = { name: req.body.name };
    try {
      if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(" ")[1],
          decoded;
        try {
          decoded = jwt.verify(authorization, process.env.JWT_SECRET);
        } catch (e) {
          return res.status(401).send("unauthorized");
        }
        let userId = decoded.id;

        const user = await User.findOne({ _id: userId });

        if (user) {
          const result = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateUser },
            { omitUndefined: true, new: true }
          ).select("-password");
          return res.status(200).json({ data: result, success: true });
        }
        return res.status(401).json({
          msg: "Unauthorized to change infomation of user",
          success: false,
        });
      }
      return res.status(500);
    } catch (error) {
      return handleError(res, error, "Cannot change infomation of user");
    }
  }

  async delete(req, res) {
    const user_id = req.params.user_id;
    try {
      const user = await User.findById(user_id).exec();
      if (user) {
        const result = await User.deleteOne({ _id: user_id });
        return res.status(200).json({ data: result, success: true });
      }
      return res.status(400).json({
        message: "user not found!",
        success: false,
      });
    } catch (error) {
      return handleError(res, error, "Cannot delete user");
    }
  }
}

module.exports = new UserController();
