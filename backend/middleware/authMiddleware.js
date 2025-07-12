import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // Then check Authorization header
    else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ msg: "Not authorized, no token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });
  next();
};
