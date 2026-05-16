const prisma = require("../config/db");

const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, username: true } } },
    });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments.", error: err.message });
  }
};

const createComment = async (req, res) => {
  const { content, postId } = req.body;
  const authorId = req.user.id;
  if (!content || !postId) {
    return res.status(400).json({ message: "Content and postId are required." });
  }
  try {
    const comment = await prisma.comment.create({
      data: { content, postId, authorId },
      include: { author: { select: { id: true, username: true } } },
    });
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ message: "Failed to create comment.", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    if (comment.authorId !== userId) return res.status(403).json({ message: "Not authorized." });

    await prisma.comment.delete({ where: { id } });
    res.json({ message: "Comment deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment.", error: err.message });
  }
};

module.exports = { getCommentsByPost, createComment, deleteComment };
