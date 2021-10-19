const express = require("express");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const quizRoute = require("./quizRoutes");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/quiz", quizRoute);

module.exports = router;
