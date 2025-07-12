import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import * as uploadController from '../controllers/uploadController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Apply authentication middleware to all routes
router.use(protect);

// Upload and analysis routes
router.post('/uploads/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    await uploadController.uploadFile(req, res, next);
  } catch (error) {
    res.status(500).json({ msg: error.message || 'Upload failed' });
  }
});

router.get('/uploads', uploadController.getUserUploads);
router.get('/uploads/:id', uploadController.getUploadDetails);
router.delete('/uploads/:id', uploadController.deleteUpload);
router.get('/stats', uploadController.getUserStats);

export default router;