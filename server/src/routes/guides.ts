import { Router, Request, Response } from 'express';
import { db } from '../db';

export const guidesRouter = Router();

// GET /api/guides - Editorial Guides for organic discovery & SEO
guidesRouter.get('/guides', (req: Request, res: Response) => {
  const guides = db.getGuides();
  res.json({
    success: true,
    count: guides.length,
    guides
  });
});

// GET /api/ledger/:userId - Point Transaction History Ledger
guidesRouter.get('/ledger/:userId', (req: Request, res: Response) => {
  const transactions = db.getPointTransactions(req.params.userId);
  res.json({
    success: true,
    count: transactions.length,
    transactions
  });
});
