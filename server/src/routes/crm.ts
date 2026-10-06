import { Router, Request, Response } from 'express';
import { db } from '../db';

export const crmRouter = Router();

// GET /api/partners/:id/portal - Restaurant Partner B2B Metrics calculated dynamically from PostgreSQL
crmRouter.get('/:id/portal', (req: Request, res: Response) => {
  const metrics = db.getPartnerPortalMetrics(req.params.id);
  res.json({
    success: true,
    partnerId: req.params.id,
    metrics
  });
});

// GET /api/businesses/:id/analytics - Real dynamic metrics
crmRouter.get('/:id/analytics', (req: Request, res: Response) => {
  const analytics = db.getPartnerPortalMetrics(req.params.id);
  res.json({
    success: true,
    businessId: req.params.id,
    analytics
  });
});

// GET /api/businesses/:id/customers - Customer CRM Profiles with consents
crmRouter.get('/:id/customers', (req: Request, res: Response) => {
  const customers = db.getCustomerProfiles();
  res.json({ success: true, count: customers.length, customers });
});
