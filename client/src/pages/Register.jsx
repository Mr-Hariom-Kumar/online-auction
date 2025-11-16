import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-1 text-center">
          Create your account
        </h2>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Join as a buyer or seller to start using the platform.
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="John Doe"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex justify-center items-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
