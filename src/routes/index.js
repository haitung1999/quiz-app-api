const express = require("express");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");

const router = express.Router();

router.use("/user", userRoute);
router.use("/auth", authRoute);

module.exports = router;
