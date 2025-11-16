import express from "express";
import Auction from "../models/Auction.js";
import { auth } from "../middleware/auth.js";
import { hasRole } from "../middleware/role.js";

const router = express.Router();

// Create auction (Seller only)
router.post("/", auth, hasRole("seller", "admin"), async (req, res) => {
  try {
    const { title, description, basePrice, startTime, endTime, images } = req.body;
    const auction = await Auction.create({
      title,
      description,
      basePrice,
      currentPrice: basePrice,
      startTime,
      endTime,
      images,
      seller: req.user._id,
    });
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all live/upcoming auctions
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const auctions = await Auction.find({
      endTime: { $gt: now },
    }).populate("seller", "name");
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get auction details
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("seller", "name")
      .populate("winner", "name");
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Close auction (auto/manual – here manual by seller/admin)
router.post("/:id/close", auth, hasRole("seller", "admin"), async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    auction.status = "closed";
    await auction.save();
    res.json({ message: "Auction closed", auction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
