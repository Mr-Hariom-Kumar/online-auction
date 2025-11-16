import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [statsRes, auctionsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/auctions"),
      ]);
      setStats(statsRes.data);
      setAuctions(auctionsRes.data);
    };
    load();
  }, []);

  if (!stats) {
    return <p className="text-sm text-slate-500">Loading admin data...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Admin Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Overview of users and auction activity.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Total Users</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.users}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Total Auctions</p>
          <p className="text-2xl font-semibold text-slate-900">
            {stats.auctions}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs text-slate-500 mb-1">Live Auctions</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {stats.liveAuctions}
          </p>
        </div>
      </div>

      {/* Auctions list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            All Auctions
          </h3>
          <span className="text-xs text-slate-400">
            {auctions.length} total
          </span>
        </div>
        {auctions.length === 0 ? (
          <p className="text-xs text-slate-500">No auctions found.</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {auctions.map((a) => (
              <div
                key={a._id}
                className="border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 line-clamp-1">
                    {a.title}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Seller: {a.seller?.name || "N/A"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">
                    ₹{a.currentPrice}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {a.status?.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
