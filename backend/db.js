import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dotenv.config();

// Safe DNS configuration for MongoDB Atlas SRV lookup
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore DNS set failure on unsupported environments
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truthguard';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5s timeout to prevent blocking
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️ MongoDB connection warning:', error.message);
    console.warn('ℹ️ Backend server running in offline/memory mode for API routes.');
  }
}
