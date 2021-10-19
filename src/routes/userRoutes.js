const express = require("express");
const userController = require("../controller/userController");
const passport = require("passport");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getAll
);

router.get(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  userController.getCurrent
);

router.put(
  "/change-info",
  passport.authenticate("jwt", { session: false }),
  userController.changeInfo
);

router.delete(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),
  userController.delete
);

module.exports = router;
