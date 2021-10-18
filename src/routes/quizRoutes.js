const express = require("express");
const quizController = require("../controller/quizController");
const passport = require("passport");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  quizController.getAll
);
router.get(
  "/detail/:quiz_id",
  passport.authenticate("jwt", { session: false }),
  quizController.getOne
);
router.post(
  "",
  passport.authenticate("jwt", { session: false }),
  quizController.create
);
router.put(
  "/:quiz_id",
  passport.authenticate("jwt", { session: false }),
  quizController.update
);
router.delete(
  "/:quiz_id",
  passport.authenticate("jwt", { session: false }),
  quizController.delete
);

module.exports = router;
