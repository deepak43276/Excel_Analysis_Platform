import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, adminCode } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    // Determine role based on admin code
    const role = adminCode === process.env.ADMIN_CODE ? "admin" : "user";

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ 
      msg: "Registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      msg: error.message || "Registration failed. Please try again."
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response with both token and user data
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      msg: error.message || "Login failed. Please try again."
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      msg: error.message || "Logout failed. Please try again."
    });
  }
};
