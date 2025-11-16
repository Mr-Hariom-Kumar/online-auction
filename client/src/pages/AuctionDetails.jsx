import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const loadData = async () => {
    const [auctionRes, bidsRes] = await Promise.all([
      api.get(`/auctions/${id}`),
      api.get(`/bids/${id}`),
    ]);
    setAuction(auctionRes.data);
    setBids(bidsRes.data);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // simple polling
    return () => clearInterval(interval);
  }, [id]);

  const placeBid = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/bids/${id}`, { amount: Number(amount) });
      setAmount("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Bid failed");
    }
  };

  if (!auction) {
    return <p className="text-sm text-slate-500">Loading auction...</p>;
  }

  const isBuyer = user?.role === "buyer";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      {/* Left: auction details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {auction.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Seller: <span className="font-medium">{auction.seller?.name}</span>
            </p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              auction.status === "live"
                ? "bg-green-100 text-green-700"
                : auction.status === "closed"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {auction.status?.toUpperCase()}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Description
          </h3>
          <p className="text-sm text-slate-600 whitespace-pre-line">
            {auction.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Base Price</p>
            <p className="text-base font-semibold text-slate-900">
              ₹{auction.basePrice}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Current Highest Bid</p>
            <p className="text-base font-semibold text-amber-600">
              ₹{auction.currentPrice}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Ends At</p>
            <p className="text-xs font-medium text-slate-800">
              {new Date(auction.endTime).toLocaleString()}
            </p>
          </div>
        </div>

        {auction.winner && (
          <div className="mt-2 text-xs text-slate-500">
            Current highest bidder:{" "}
            <span className="font-medium text-slate-800">
              {auction.winner?.name || "Hidden"}
            </span>
          </div>
        )}
      </div>

      {/* Right: bid form + history */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Place Your Bid
          </h3>
          {!user && (
            <p className="text-xs text-slate-500">
              Please log in as a buyer to place a bid.
            </p>
          )}
          {user && !isBuyer && (
            <p className="text-xs text-slate-500">
              Only buyer accounts can place bids.
            </p>
          )}
          {auction.status === "closed" && (
            <p className="text-xs text-red-600 mt-1">
              This auction has ended. Bidding is closed.
            </p>
          )}

          {error && (
            <p className="mt-2 mb-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {user && isBuyer && auction.status !== "closed" && (
            <form onSubmit={placeBid} className="space-y-3 mt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Bid Amount (must be higher than ₹{auction.currentPrice})
                </label>
                <input
                  type="number"
                  value={amount}
                  min={auction.currentPrice + 1}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder={`₹${auction.currentPrice + 1} or more`}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Place Bid
              </button>
            </form>
          )}
        </div>

        {/* Bid history */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Bid History
            </h3>
            <span className="text-xs text-slate-400">
              {bids.length} {bids.length === 1 ? "bid" : "bids"}
            </span>
          </div>
          {bids.length === 0 ? (
            <p className="text-xs text-slate-500">
              No bids yet. Be the first to bid!
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {bids.map((b) => (
                <div
                  key={b._id}
                  className="border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {b.bidder?.name || "Bidder"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(b.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold text-amber-600">
                    ₹{b.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
