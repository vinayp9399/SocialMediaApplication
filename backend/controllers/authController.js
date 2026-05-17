const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

// Centralized cookie configuration so login, signup, and logout are identical
const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  sameSite: "none", // Force this to be lowercase "none" string
  secure: true,     // Force this to be true for HTTPS
};

const signup = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      const field = existing.email === email ? "Email" : "Username";
      return res.status(409).json({ message: `${field} already exists.` });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, username },
      select: { id: true, email: true, username: true },
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Signup failed.", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    // Changed to findFirst to avoid strict @unique schema constraints crashing the runtime
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return res.status(404).json({ message: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password." });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // FIXED: Now using the exact cross-origin cookie properties required by the browser
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

const logout = (req, res) => {
  // FIXED: Clearing cookies cross-origin requires passing the exact same option flags
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out." });
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true },
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user.", error: err.message });
  }
};

module.exports = { signup, login, logout, getMe };