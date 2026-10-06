import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { checkDatabaseConnection } from './prisma';
import { placesRouter } from './routes/places';
import { checkInsRouter } from './routes/checkins';
import { ordersRouter } from './routes/orders';
import { crmRouter } from './routes/crm';
import { regionalRoutesRouter } from './routes/routes';
import { b2gRouter } from './routes/b2g';
import { guidesRouter } from './routes/guides';
import { authRouter } from './routes/auth';
import { adminRouter } from './routes/admin';
import { businessRouter } from './routes/business';
import { devRouter } from './routes/dev';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '0.3.0',
    platform: 'Valpar Regional SaaS Platform (B2C Mobile, Admin CMS & B2B Partner Portal)',
    database: 'PostgreSQL Active (Prisma ORM)',
    timestamp: new Date().toISOString()
  });
});

// REST API Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/business', businessRouter);
app.use('/api/places', placesRouter);
app.use('/api/dev', devRouter);
app.use('/api/checkins', checkInsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/businesses', crmRouter);
app.use('/api/b2g', b2gRouter);
app.use('/api', regionalRoutesRouter);
app.use('/api', guidesRouter);

async function startServer() {
  await checkDatabaseConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Valpar Backend API Server v0.3.0 running on http://localhost:${PORT}`);
  });
}

startServer();
