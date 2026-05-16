const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getCommentsByPost, createComment, deleteComment } = require("../controllers/commentController");

router.get("/:postId",   getCommentsByPost);
router.post("/",         verifyToken, createComment);
router.delete("/:id",    verifyToken, deleteComment);

module.exports = router;
