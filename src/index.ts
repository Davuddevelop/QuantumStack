import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import logger from './utils/logger';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for serving static frontend if needed
}));

// CORS Configuration
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// Static Files
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// API Routes
app.use('/api', routes);

// Base Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorMiddleware);

// Server Start
if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    logger.info(`QuantumStack Backend running on port ${config.port} [${config.nodeEnv}]`);
  });
}

export default app;
