import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    // console.log('Connecting to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI);
    // MongoDB connected successfully
  } catch (err) {
    process.exit(1);
  }
};

export default connectDB;
