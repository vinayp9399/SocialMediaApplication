const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getAllPosts, getPostsByCommunity, getPostById, createPost, deletePost } = require("../controllers/postController");

router.get("/",                      getAllPosts);
router.get("/community/:slug",       getPostsByCommunity);
router.get("/:id",                   getPostById);
router.post("/",      verifyToken,   createPost);
router.delete("/:id", verifyToken,   deletePost);

module.exports = router;
