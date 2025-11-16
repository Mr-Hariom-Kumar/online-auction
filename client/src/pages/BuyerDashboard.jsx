import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import AuctionCard from "../components/AuctionCard.jsx";

export default function BuyerDashboard() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      const res = await api.get("/auctions");
      setAuctions(res.data);
    };
    fetchAuctions();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Active & Upcoming Auctions
          </h2>
          <p className="text-sm text-slate-500">
            Explore items and participate in live bidding.
          </p>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="mt-6 bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-sm text-slate-500">
          No auctions are live right now. Check back later.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((a) => (
            <AuctionCard
              key={a._id}
              auction={a}
              onClick={() => navigate(`/auction/${a._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
