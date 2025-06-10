import User from '../../models/User.js';
import Upload from '../../models/Upload.js';

// User Management
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, role } = req.body;

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either "user" or "admin"' });
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      user.email = email;
    }

    // Update role if provided
    if (role) {
      user.role = role;
    }

    const updatedUser = await user.save();
    res.json({ 
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Management
export const getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    if (!uploads[0]?.user?.username) {
      const populatedUploads = await Promise.all(uploads.map(async (upload) => {
        try {
          const user = await User.findById(upload.user);
          return {
            ...upload.toObject(),
            user: user ? { username: user.username, email: user.email } : { username: 'Unknown user', email: 'N/A' }
          };
        } catch (userError) {
          return {
            ...upload.toObject(),
            user: { username: 'Unknown user', email: 'N/A' }
          };
        }
      }));
      res.json(populatedUploads);
    } else {
      res.json(uploads);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUploadById = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id).populate('user', 'name email');
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    res.json(upload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    await upload.deleteOne();
    res.json({ message: 'Upload removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analytics
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await Upload.countDocuments();
    const totalStorage = await Upload.aggregate([
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ]);

    res.json({
      totalUsers,
      totalUploads,
      totalStorage: totalStorage[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyStats = async (req, res) => {
  try {
    const dailyStats = await Upload.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$uploadDate' } },
          count: { $sum: 1 },
          totalSize: { $sum: '$fileSize' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStorageAnalytics = async (req, res) => {
  try {
    const storageByUser = await Upload.aggregate([
      {
        $group: {
          _id: '$user',
          totalSize: { $sum: '$fileSize' },
          fileCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          totalSize: 1,
          fileCount: 1,
          user: { $arrayElemAt: ['$userDetails', 0] }
        }
      }
    ]);

    res.json(storageByUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 