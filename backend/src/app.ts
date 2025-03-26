import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import productRoutes from './routes/product.routes';
import { seedProducts } from './database/seeds/productSeeder';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB and seed data
const initializeDatabase = async () => {
  await connectDatabase();
  await seedProducts();
};

initializeDatabase()
  .then(() => logger.info('Database initialized and seeded'))
  .catch((error) => {
    logger.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined')); // HTTP request logger

// Routesdsdvsd
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 