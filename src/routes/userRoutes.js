const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.get("/", userController.getAll);

module.exports = router;
