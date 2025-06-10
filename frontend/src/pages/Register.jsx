import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "",
    adminCode: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      navigate("/login");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-blue-700">
        {/* <img 
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Data analytics background"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
          {/* Logo/Header */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-center mb-6 text-gray-800"
          >
            Join Our Platform
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-600">Username</label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileFocus={{ scaleX: 1 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-600">Email</label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileFocus={{ scaleX: 1 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-600">Password</label>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileFocus={{ scaleX: 1 }}
                />
              </motion.div>
            </motion.div>

            <div>
              <label className="block text-gray-700 mb-1">Admin Code (Optional)</label>
              <input
                className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-600 bg-transparent outline-none transition"
                type="password"
                name="adminCode"
                placeholder="Enter admin code if you have one"
                value={form.adminCode}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave this empty for a regular user account
              </p>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 rounded-lg text-white font-medium transition-all ${
                loading
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center pt-4"
            >
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/login"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-medium hover:from-blue-600 hover:to-purple-600"
                  >
                    Sign In
                  </Link>
                </motion.span>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}