const express = require("express");
const quizController = require("../controller/quizController");
const passport = require("passport");

const router = express.Router();

router.get("/", quizController.getAll);
router.get("/detail/:quiz_id", quizController.getOne);
router.post(
  "",
  passport.authenticate("jwt", { session: false }),
  quizController.create
);

module.exports = router;
