import errorHandler from '@middlewares/errorHandler';
import notFoundHandler from '@middlewares/notFoundHandler';

import { getPort } from '@envs/vairables';

import { logger } from '@logs';
import mainRouter from '@routes';
import cors from 'cors';
import dbConnect from 'database/db';
import { config } from 'dotenv';
import express from 'express';

// Crons

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/v1', mainRouter(), notFoundHandler, errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    await dbConnect();
    const PORT = getPort();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

export { app, startServer };
