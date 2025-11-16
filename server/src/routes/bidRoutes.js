import express from "express";
import { auth } from "../middleware/auth.js";
import { hasRole } from "../middleware/role.js";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

const router = express.Router();

// Place bid
router.post("/:auctionId", auth, hasRole("buyer"), async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.auctionId);

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const now = new Date();
    if (auction.endTime <= now || auction.status === "closed") {
      return res.status(400).json({ message: "Auction already ended" });
    }

    if (amount <= auction.currentPrice) {
      return res
        .status(400)
        .json({ message: "Bid amount must be higher than current highest bid" });
    }

    const bid = await Bid.create({
      auction: auction._id,
      bidder: req.user._id,
      amount,
    });

    auction.currentPrice = amount;
    auction.winner = req.user._id;
    auction.status = "live";
    await auction.save();

    res.status(201).json({ message: "Bid placed successfully", bid, auction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bids for auction
router.get("/:auctionId", auth, async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .sort({ createdAt: -1 })
      .populate("bidder", "name");
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all bids of the logged-in buyer
router.get("/my", auth, hasRole("buyer"), async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .sort({ createdAt: -1 })
      .populate("auction", "title currentPrice status endTime");
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
