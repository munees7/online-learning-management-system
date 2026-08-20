import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../redux/slices/authSlice";
import { registerAdmin } from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiShield, FiEye, FiEyeOff, FiBookOpen } from "react-icons/fi";

export default function AdminRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", adminSecret: "" });

  // If already logged in as admin, redirect
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!form.adminSecret) return toast.error("Admin secret key is required");
    setLoading(true);
    try {
      const res = await registerAdmin(form);
      localStorage.setItem("lms_token", res.data.token);
      toast.success("Admin account created!");
      navigate("/admin");
      // Reload to trigger loadUser
      window.location.href = "/admin";
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold text-2xl mb-4">
              <FiBookOpen className="text-3xl" /> LearnHub
            </Link>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiShield className="text-3xl text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Registration</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Requires a valid admin secret key
            </p>
          </div>

          {/* Warning banner */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6 flex items-start gap-2">
            <FiShield className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              This page is for authorized administrators only. You need the admin secret key to create an admin account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input pl-10" placeholder="Admin Name" required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-10" placeholder="admin@example.com" required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10" placeholder="Min 6 characters" required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Admin Secret */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Admin Secret Key
                <span className="ml-2 text-xs text-red-500 font-normal">* Required</span>
              </label>
              <div className="relative">
                <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                <input
                  type={showSecret ? "text" : "password"} value={form.adminSecret}
                  onChange={(e) => setForm({ ...form, adminSecret: e.target.value })}
                  className="input pl-10 pr-10 border-red-200 dark:border-red-800 focus:ring-red-500"
                  placeholder="Enter admin secret key" required
                />
                <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showSecret ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Set in server <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env</code> as <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ADMIN_SECRET</code>
              </p>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><FiShield /> Create Admin Account</>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
            </p>
            <p>
              Not an admin?{" "}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Regular signup</Link>
            </p>
          </div>
        </div>

        {/* Dev hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Default secret (dev): <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">admin@secret2024</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
