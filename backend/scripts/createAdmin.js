import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin account created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin(); 