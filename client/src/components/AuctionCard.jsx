// client/src/components/AuctionCard.jsx
export default function AuctionCard({ auction, onClick }) {
  const { title, description, status, seller, basePrice, currentPrice } = auction;

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition p-4 flex flex-col gap-2 w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 line-clamp-2">
          {title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "live"
              ? "bg-green-100 text-green-700"
              : status === "closed"
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {status?.toUpperCase()}
        </span>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2">
        {description}
      </p>

      <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
        <span>Seller: {seller?.name || "Unknown"}</span>
        <span>Base: ₹{basePrice}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">Current Price</span>
        <span className="text-base font-semibold text-amber-600">
          ₹{currentPrice}
        </span>
      </div>
    </button>
  );
}
