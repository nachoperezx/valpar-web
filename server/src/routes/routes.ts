import { Router, Request, Response } from 'express';
import { db } from '../db';

export const regionalRoutesRouter = Router();

// GET /api/routes - Regional Passport Routes
regionalRoutesRouter.get('/routes', (req: Request, res: Response) => {
  const routes = db.getRoutes();
  res.json({ success: true, count: routes.length, routes });
});

// GET /api/missions - Local venue missions
regionalRoutesRouter.get('/missions', (req: Request, res: Response) => {
  const missions = db.getLocalMissions();
  res.json({ success: true, count: missions.length, missions });
});
