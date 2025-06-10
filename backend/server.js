

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';
import { mkdir } from 'fs/promises';
import adminRoutes from './admin/index.js';


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Create uploads directory if it doesn't exist
mkdir('uploads').catch(() => {});

app.use("/api/auth", authRoutes);
app.use('/api', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => res.send("API running"));

// Catch-all error handler for unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ msg: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
