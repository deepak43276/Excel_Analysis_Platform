import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { mkdir } from 'fs/promises';
import adminRoutes from './admin/index.js';

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://excel-analytics-frontend.vercel.app",
  "https://excel-analytics-frontend-git-main.vercel.app",
  "https://excel-analytics-frontend-git-develop.vercel.app",
  "https://excel-analysis-platform-wine.vercel.app"
];

// Add environment variable for additional origins
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Create uploads directory if it doesn't exist
mkdir('uploads').catch(() => {});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => res.send("API running"));

// Error logging middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {/* Server started */});
