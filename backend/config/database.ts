import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongodbUriRaw = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskscheduler';

// Sanitize URI for logging (remove credentials if present)
const sanitizeUri = (uri: string) => {
  try {
    // If URI contains credentials like mongodb://user:pass@host, mask userinfo
    return uri.replace(/:\/\/(.*@)/, '://<REDACTED>@');
  } catch {
    return uri;
  }
};

const mongodbUri = mongodbUriRaw;

mongoose.set('strictQuery', false);

console.log(`Attempting MongoDB connection to: ${sanitizeUri(mongodbUri)}`);

mongoose.connect(mongodbUri, {
  dbName: 'taskscheduler',
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.error('Error connecting to MongoDB (initial connect):', err.message);
  });

// Attach connection event handlers for more visibility
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connection event: connected');
});

db.on('error', (err) => {
  console.error('Mongoose connection event: error', err && err.message ? err.message : err);
});

db.on('disconnected', () => {
  console.warn('Mongoose connection event: disconnected');
});

db.on('reconnected', () => {
  console.log('Mongoose connection event: reconnected');
});

db.on('close', () => {
  console.log('Mongoose connection event: close');
});

export default mongoose;
