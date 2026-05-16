const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getAllCommunities, getCommunityBySlug, createCommunity } = require("../controllers/communityController");

router.get("/",       getAllCommunities);
router.get("/:slug",  getCommunityBySlug);
router.post("/",      verifyToken, createCommunity);

module.exports = router;
