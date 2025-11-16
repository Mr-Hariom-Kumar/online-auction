import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/bids/my");
      setBids(res.data);
    } catch (err) {
      console.error("Failed to load bids", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading your bids...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">My Bids</h2>
        <p className="text-sm text-slate-500">
          Track all the auctions where you have placed bids.
        </p>
      </div>

      {bids.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-sm text-slate-500">
          You haven&apos;t placed any bids yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {bids.map((b) => (
              <div
                key={b._id}
                className="border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 line-clamp-1">
                    {b.auction?.title || "Auction"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Placed on: {new Date(b.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">₹{b.amount}</p>
                  <p className="text-[11px] text-slate-500">
                    Status: {b.auction?.status?.toUpperCase() || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
