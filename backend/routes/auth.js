const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { signup, login, logout, getMe } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login",  login);
router.post("/logout", logout);
router.get("/me",      verifyToken, getMe);

module.exports = router;
