import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUploads,
  getUploadById,
  deleteUpload,
  getStats,
  getDailyStats,
  getStorageAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(isAdmin);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Upload management routes
router.get('/uploads', getAllUploads);
router.get('/uploads/:id', getUploadById);
router.delete('/uploads/:id', deleteUpload);

// Analytics routes
router.get('/stats', getStats);
router.get('/stats/daily', getDailyStats);
router.get('/stats/storage', getStorageAnalytics);

export default router;
