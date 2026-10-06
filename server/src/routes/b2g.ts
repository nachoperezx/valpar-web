import { Router, Request, Response } from 'express';
import { db } from '../db';

export const b2gRouter = Router();

// GET /api/b2g/analytics - Panel de Administración Regional (B2G - Municipalidades / Gremios de Turismo)
b2gRouter.get('/analytics', (req: Request, res: Response) => {
  const analytics = db.getRegionalB2GAnalytics();
  res.json({
    success: true,
    analytics
  });
});

// GET /api/b2g/audit-logs - Enterprise Audit Logs for SaaS Compliance
b2gRouter.get('/audit-logs', (req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({
    success: true,
    count: logs.length,
    logs
  });
});
