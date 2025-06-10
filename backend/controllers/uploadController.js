import Upload from '../models/Upload.js';
import { processExcelFile } from '../utils/excelProcessor.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res) => {
  // console.log('Upload controller called with file:', req.file?.originalname);
  try {
    if (!req.file) {
      // console.log('No file received in controller');
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { analysisType = 'basic' } = req.body;

    // Create upload record
    const upload = await Upload.create({
      user: new mongoose.Types.ObjectId(req.user.id),
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      analysisType,
      status: 'processing'
    });

    // console.log('Upload record created:', upload._id);
    // console.log('Initial upload record:', upload);

    // Get absolute path to the file
    const filePath = path.resolve(__dirname, '..', req.file.path);
    // console.log('File path for processing:', filePath);

    // Process file in background
    try {
      processExcelFile(filePath, analysisType)
        .then(async (results) => {
          try {
            upload.analysisResults = results;
            upload.status = 'completed';
            await upload.save();
            // Delete the file after processing
            try {
              await fs.unlink(filePath);
            } catch (err) {
              // Don't throw error if file deletion fails
            }
          } catch (error) {
            console.error('Error saving upload results:', error);
            upload.status = 'failed';
            upload.error = error.message;
            await upload.save();
          }
        })
        .catch(async (error) => {
          console.error(`Upload ${upload._id} processing failed:`, error);
          upload.status = 'failed';
          upload.error = error.message;
          await upload.save();
          // Delete the file if processing failed
          try {
            await fs.unlink(filePath);
          } catch (err) {
            // Don't throw error if file deletion fails
          }
        });
    } catch (processError) {
      console.error('Synchronous error during processExcelFile invocation:', processError);
      upload.status = 'failed';
      upload.error = processError.message;
      await upload.save();
      return res.status(500).json({ msg: processError.message || 'Excel processing failed unexpectedly' });
    }

    res.status(201).json({
      msg: 'File uploaded successfully',
      upload: {
        id: upload._id,
        filename: upload.filename,
        status: upload.status,
        createdAt: upload.createdAt
      }
    });
  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({ msg: error.message || 'Upload failed' });
  }
};

export const getUserUploads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user.id };
    
    if (status) query.status = status;

    const uploads = await Upload.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Upload.countDocuments(query);

    res.json({
      uploads,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUploadDetails = async (req, res) => {
  try {
    let upload;
    if (req.user.role === 'admin') {
      upload = await Upload.findById(req.params.id).populate('user', 'username email');
    } else {
      upload = await Upload.findOne({
        _id: req.params.id,
        user: req.user.id
      }).populate('user', 'username email');
    }

    if (!upload) {
      return res.status(404).json({ msg: 'Upload not found' });
    }

    res.json(upload);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!upload) {
      return res.status(404).json({ msg: 'Upload not found' });
    }

    await upload.deleteOne();
    res.json({ msg: 'Upload deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    // console.log('Fetching stats for user ID:', req.user?.id);
    const stats = await Upload.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id: null,
          totalUploads: { $sum: 1 },
          totalStorage: { $sum: '$fileSize' },
          completedUploads: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failedUploads: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      }
    ]);

    // console.log('Aggregation results:', stats);

    const recentUploads = await Upload.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // console.log('Stats data being sent to frontend:', {
    //   stats: stats[0] || {
    //     totalUploads: 0,
    //     totalStorage: 0,
    //     completedUploads: 0,
    //     failedUploads: 0
    //   },
    //   recentUploads
    // });

    res.json({
      stats: stats[0] || {
        totalUploads: 0,
        totalStorage: 0,
        completedUploads: 0,
        failedUploads: 0
      },
      recentUploads
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};