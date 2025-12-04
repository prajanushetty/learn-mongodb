import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import router from './routes/index';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// Middleware setup
app.use(cors({
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

// Routes setup
app.use('/', router());

// Create and start HTTP server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', err);
  }
});

// MongoDB connection (optional in development)
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://prajanshettyu_db_user:<KvBdBm1iVy7rDOh1>@cluster0.vge7nqo.mongodb.net/?appName=Cluster0';

if (MONGO_URL.includes('<')) {
  console.warn('MONGO_URL contains placeholder credentials. Set MONGO_URL env var to enable MongoDB.');
} else {
  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB error:', error);
  });
}