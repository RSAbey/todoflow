/**
 * MongoDB / Mongoose connection helpers.
 * Importing this module does not connect automatically.
 */
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

/**
 * Connect to MongoDB using MONGODB_URI (or an explicit override for tests).
 * Does not log the connection string (avoids leaking credentials).
 */
async function connectDB(mongoUri = process.env.MONGODB_URI) {
  const uri = typeof mongoUri === 'string' ? mongoUri.trim() : '';

  if (!uri) {
    throw new Error(
      'MONGODB_URI is missing. Set it in backend/.env or backend/.env.local (see .env.example). A database connection is required to start the TodoFlow API server.',
    );
  }

  try {
    await mongoose.connect(uri);
  } catch (err) {
    const detail = err && err.message ? err.message : 'Unknown connection error';
    throw new Error(`MongoDB connection failed: ${detail}`);
  }

  console.log('MongoDB connected successfully');

  return mongoose.connection;
}

async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
