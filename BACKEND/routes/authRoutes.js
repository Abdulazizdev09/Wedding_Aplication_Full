const express = require("express");
const { logIn } = require("../controllers/auth/login");
const { register } = require("../controllers/auth/register");
const router = express.Router();

router.post("/register", register)
router.post("/login", logIn);

module.exports = router