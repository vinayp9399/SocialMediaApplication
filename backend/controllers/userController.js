const prisma = require("../config/db");

const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id:       true,
        username: true,
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            community: { select: { id: true, name: true, slug: true } },
            _count:    { select: { comments: true, votes: true } },
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            post: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile.", error: err.message });
  }
};

module.exports = { getUserProfile };
