const prisma = require("../config/db");

const postInclude = {
  author: { select: { id: true, username: true } },
  community: { select: { id: true, name: true, slug: true } },
  _count: { select: { comments: true, votes: true } },
};

const getAllPosts = async (req, res) => {
  const { sort = "latest" } = req.query;
  try {
    const posts = await prisma.post.findMany({
      orderBy: sort === "popular"
        ? { votes: { _count: "desc" } }
        : { createdAt: "desc" },
      include: postInclude,
    });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts.", error: err.message });
  }
};

const getPostsByCommunity = async (req, res) => {
  const { slug } = req.params;
  const { sort = "latest" } = req.query;
  try {
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) return res.status(404).json({ message: "Community not found." });

    const posts = await prisma.post.findMany({
      where: { communityId: community.id },
      orderBy: sort === "popular"
        ? { votes: { _count: "desc" } }
        : { createdAt: "desc" },
      include: postInclude,
    });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts.", error: err.message });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        ...postInclude,
        votes: true,
        comments: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { id: true, username: true } } },
        },
      },
    });
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post.", error: err.message });
  }
};

const createPost = async (req, res) => {
  const { title, content, communityId, imageUrl } = req.body;
  const authorId = req.user.id;
  if (!title || !content || !communityId) {
    return res.status(400).json({ message: "Title, content and communityId are required." });
  }
  try {
    const post = await prisma.post.create({
      data: { title, content, imageUrl: imageUrl || null, communityId, authorId },
      include: postInclude,
    });
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Failed to create post.", error: err.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.authorId !== userId) return res.status(403).json({ message: "Not authorized." });

    await prisma.vote.deleteMany({ where: { postId: id } });
    await prisma.comment.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });
    res.json({ message: "Post deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post.", error: err.message });
  }
};

module.exports = { getAllPosts, getPostsByCommunity, getPostById, createPost, deletePost };
