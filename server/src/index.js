// server/src/index.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS SETUP ---
const allowedOrigins = [
  "http://localhost:5173",           // Vite dev
  process.env.FRONTEND_URL || ""     // your deployed frontend (Render)
];

app.use(
  cors({
    origin(origin, cb) {
      // allow tools like Postman (no origin)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: false
  })
);

// --- MIDDLEWARE ---
app.use(express.json());
app.use(morgan("dev"));

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Online Auction API running" });
});

// --- DB + SERVER START ---
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
