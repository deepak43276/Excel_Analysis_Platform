import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  analysisType: {
    type: String,
    enum: ['basic', 'advanced', 'custom'],
    required: true
  },
  analysisResults: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Add indexes for better query performance
uploadSchema.index({ user: 1, createdAt: -1 });
uploadSchema.index({ status: 1 });

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;