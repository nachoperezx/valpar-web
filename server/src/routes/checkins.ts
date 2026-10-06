import { Router, Request, Response } from 'express';
import { db } from '../db';

export const checkInsRouter = Router();

// POST /api/checkins - Hybrid Cryptographic NFC Check-In (NFC + Backend + GPS)
checkInsRouter.post('/', (req: Request, res: Response) => {
  const { placeId, userId, nfcTagId, userLat, userLng } = req.body;

  if (!placeId) {
    return res.status(400).json({ success: false, message: 'Falta placeId requerido.' });
  }

  const place = db.getPlaceById(placeId);
  if (!place) {
    return res.status(404).json({ success: false, message: 'Lugar no encontrado.' });
  }

  try {
    const result = db.createHybridCheckIn({
      placeId,
      userId: userId || 'user-valpo-01',
      nfcTagId: nfcTagId || place.nfcTagId,
      userLat: userLat || -33.0425,
      userLng: userLng || -71.6256
    });

    res.json({
      success: true,
      message: result.visit.isFirstVisit
        ? `¡Bienvenido/a por primera vez a ${place.name}! Recibiste tu WelcomeReward.`
        : `¡Check-In NFC Verificado en ${place.name}! Ganaste 100 puntos.`,
      checkIn: result.checkIn,
      visit: result.visit,
      welcomeReward: result.welcomeReward,
      isFirstVisit: result.visit.isFirstVisit,
      pointsAwarded: result.visit.pointsEarned
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/visits - Get visits history
checkInsRouter.get('/visits', (req: Request, res: Response) => {
  const visits = db.getVisits();
  res.json({ success: true, count: visits.length, visits });
});
