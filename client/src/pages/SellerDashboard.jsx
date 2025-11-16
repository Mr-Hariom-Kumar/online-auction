import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function SellerDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    startTime: "",
    endTime: "",
  });
  const [myAuctions, setMyAuctions] = useState([]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const loadMyAuctions = async () => {
    const res = await api.get("/auctions");
    setMyAuctions(res.data); // later you can filter by seller on backend
  };

  useEffect(() => {
    loadMyAuctions();
  }, []);

  const createAuction = async (e) => {
    e.preventDefault();
    await api.post("/auctions", {
      ...form,
      basePrice: Number(form.basePrice),
    });
    setForm({
      title: "",
      description: "",
      basePrice: "",
      startTime: "",
      endTime: "",
    });
    loadMyAuctions();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      {/* Create auction */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Create New Auction
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          List a new item with base price and auction duration.
        </p>
        <form onSubmit={createAuction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Vintage watch, gaming laptop, etc."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Describe item condition, brand, etc."
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Base Price (₹)
              </label>
              <input
                name="basePrice"
                type="number"
                value={form.basePrice}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Time
              </label>
              <input
                name="startTime"
                type="datetime-local"
                value={form.startTime}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                End Time
              </label>
              <input
                name="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex justify-center items-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Create Auction
          </button>
        </form>
      </div>

      {/* My auctions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            My Auctions
          </h2>
        </div>
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {myAuctions.length === 0 ? (
            <p className="text-sm text-slate-500">
              You haven&apos;t created any auctions yet.
            </p>
          ) : (
            myAuctions.map((a) => (
              <div
                key={a._id}
                className="border border-slate-100 rounded-xl px-3 py-2.5 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1">
                    {a.title}
                  </p>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full ${
                      a.status === "live"
                        ? "bg-green-100 text-green-700"
                        : a.status === "closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Current: ₹{a.currentPrice}</span>
                  <span>Base: ₹{a.basePrice}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
