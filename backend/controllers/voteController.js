const prisma = require("../config/db");

const votePost = async (req, res) => {
  const { postId, type } = req.body;
  const userId = req.user.id;

  if (!postId || !type) {
    return res.status(400).json({ message: "postId and type are required." });
  }
  if (type !== "up" && type !== "down") {
    return res.status(400).json({ message: "type must be 'up' or 'down'." });
  }
  try {
    const existing = await prisma.vote.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!existing) {
      const vote = await prisma.vote.create({ data: { type, userId, postId } });
      return res.status(201).json({ action: "created", vote });
    }
    if (existing.type === type) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return res.json({ action: "removed" });
    }
    const vote = await prisma.vote.update({
      where: { id: existing.id },
      data: { type },
    });
    return res.json({ action: "switched", vote });
  } catch (err) {
    res.status(500).json({ message: "Failed to process vote.", error: err.message });
  }
};

module.exports = { votePost };
