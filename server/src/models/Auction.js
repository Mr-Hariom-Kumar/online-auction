import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    currentPrice: { type: Number, default: 0 },
    images: [{ type: String }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "live", "closed"],
      default: "upcoming",
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);
