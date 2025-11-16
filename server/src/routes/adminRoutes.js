import express from "express";
import { auth } from "../middleware/auth.js";
import { hasRole } from "../middleware/role.js";
import User from "../models/User.js";
import Auction from "../models/Auction.js";

const router = express.Router();

router.get("/stats", auth, hasRole("admin"), async (req, res) => {
  const users = await User.countDocuments();
  const auctions = await Auction.countDocuments();
  const liveAuctions = await Auction.countDocuments({ status: "live" });
  res.json({ users, auctions, liveAuctions });
});

export default router;
