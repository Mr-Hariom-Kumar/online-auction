import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import AuctionDetails from "./pages/AuctionDetails.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import MyBids from "./pages/MyBids.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const NavLinkItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-amber-500 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      {children}
    </Link>
  );
};

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-slate-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-white font-bold">
              A
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-slate-900 text-sm sm:text-base">
                AuctionHub
              </span>
              <span className="text-xs text-slate-500">
                Online Auction System
              </span>
            </div>
          </div>

          {/* Center nav */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <NavLinkItem to="/">Auctions</NavLinkItem>
              {user?.role === "buyer" && (
                <NavLinkItem to="/my-bids">My Bids</NavLinkItem>
              )}
              {user?.role === "seller" && (
                <NavLinkItem to="/seller">Seller Dashboard</NavLinkItem>
              )}
              {user?.role === "admin" && (
                <NavLinkItem to="/admin">Admin</NavLinkItem>
              )}
            </div>
          </div>

          {/* Right side auth */}
          <div className="flex items-center gap-2">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs sm:text-sm text-slate-700">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="text-xs sm:text-sm font-medium border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<BuyerDashboard />} />
            <Route path="/auction/:id" element={<AuctionDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/seller"
              element={
                <ProtectedRoute roles={["seller", "admin"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bids"
              element={
                <ProtectedRoute roles={["buyer"]}>
                  <MyBids />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      <footer className="border-t bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs max-sm:gap-5 text-white flex justify-between">
          <span>© {new Date().getFullYear()} AuctionHub</span>
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
            deserunt labore eaque corporis eos id iste modi tenetur, repellat
            est rem ratione fugiat Enim nostrum corrupti repellat omnis
            quibusdam incidunt?
          </span>
        </div>
      </footer>
    </div>
  );
}
