import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ msg: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    await protect(req, res, () => {
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ msg: 'Not authorized as admin' });
      }
    });
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
}; 