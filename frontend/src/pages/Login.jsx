import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      navigate("/");
    } catch {}
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')", // Use a professional analytics/abstract image
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80" />
      <div className="relative z-10 w-full max-w-5xl mx-auto flex rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg">
        {/* Left Section */}
        <div className="w-1/2 bg-white/10 p-10 flex flex-col justify-center">
          <div>
            <div className="flex items-center mb-8">
              <span className="text-3xl mr-2">📊</span>
              <span className="text-2xl font-bold text-white tracking-wide">Excel Analytics</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Welcome!</h2>
            <h3 className="text-xl text-blue-200 font-semibold mb-4">To Your Analytics Platform</h3>
            <p className="text-blue-100 mb-8">
              Upload, analyze, and visualize your Excel data with AI-powered insights. Unlock the full potential of your spreadsheets!
            </p>
          </div>
        </div>
        {/* Right Section */}
        <div className="w-1/2 bg-white/90 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-600 bg-transparent outline-none transition"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12H8m8 0a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" /></svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-600 bg-transparent outline-none transition"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-2a6 6 0 1 0-12 0 6 6 0 0 0 12 0z" /></svg>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="hover:underline text-blue-600">Forgot password?</a>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 rounded-md text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
            <div className="text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-700 font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}