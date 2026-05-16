const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { votePost } = require("../controllers/voteController");

router.post("/", verifyToken, votePost);

module.exports = router;
