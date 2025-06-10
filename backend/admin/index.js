import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import * as adminController from './controllers/adminController.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, adminOnly);

// User Management Routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Upload Management Routes
router.get('/uploads', adminController.getAllUploads);
router.get('/uploads/:id', adminController.getUploadById);
router.delete('/uploads/:id', adminController.deleteUpload);

// Analytics Routes
router.get('/stats', adminController.getStats);
router.get('/analytics/daily', adminController.getDailyStats);
router.get('/analytics/storage', adminController.getStorageAnalytics);

export default router; 