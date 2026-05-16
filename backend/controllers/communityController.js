const prisma = require("../config/db");

const getAllCommunities = async (req, res) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { posts: true } } },
    });
    res.json({ communities });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch communities.", error: err.message });
  }
};

const getCommunityBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const community = await prisma.community.findUnique({
      where: { slug },
      include: { _count: { select: { posts: true } } },
    });
    if (!community) return res.status(404).json({ message: "Community not found." });
    res.json({ community });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch community.", error: err.message });
  }
};

const createCommunity = async (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: "Name and slug are required." });
  }
  try {
    const existing = await prisma.community.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing) return res.status(409).json({ message: "Community name or slug already exists." });

    const community = await prisma.community.create({
      data: { name, slug },
    });
    res.status(201).json({ community });
  } catch (err) {
    res.status(500).json({ message: "Failed to create community.", error: err.message });
  }
};

module.exports = { getAllCommunities, getCommunityBySlug, createCommunity };
