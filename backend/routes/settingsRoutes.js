import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Settings routes
router.get('/', settingsController.getSettings);
router.post('/', settingsController.saveSettings);
router.patch('/', settingsController.updateSetting);
router.post('/reset', settingsController.resetSettings);

export default router; 