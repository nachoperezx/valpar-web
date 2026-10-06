import { Router, Response } from 'express';
import { db } from '../db';
import { prisma, getIsDbConnected } from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { calculateDistanceKm } from '../utils/geo';
import {
  CHECKIN_COOLDOWN_HOURS,
  POINTS,
  getCheckInMaxDistanceMeters,
  isRemoteCheckInAllowed
} from '../config';

export const checkInsRouter = Router();

checkInsRouter.use(authenticateToken);

// POST /api/checkins - Hybrid NFC Check-In (NFC + Backend + GPS).
// The user always comes from the session token, never from the request body.
checkInsRouter.post('/', async (req: AuthRequest, res: Response) => {
  const { placeId, nfcTagId } = req.body;
  const userId = req.user!.id;
  const userLat = Number(req.body.userLat);
  const userLng = Number(req.body.userLng);
  const hasGps = Number.isFinite(userLat) && Number.isFinite(userLng) && req.body.userLat != null && req.body.userLng != null;

  if (!placeId) {
    return res.status(400).json({ success: false, message: 'Falta placeId requerido.' });
  }
  if (!hasGps && !isRemoteCheckInAllowed()) {
    return res.status(400).json({ success: false, message: 'Necesitamos tu ubicación GPS para validar la visita.' });
  }

  try {
    if (getIsDbConnected()) {
      const [user, place] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
        prisma.place.findFirst({ where: { id: placeId, publicationStatus: 'PUBLISHED' } })
      ]);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Usuario no encontrado. Inicia sesión nuevamente.' });
      }
      if (!place) {
        return res.status(404).json({ success: false, message: 'Lugar no encontrado.' });
      }

      const tag = await prisma.nfcTag.findFirst({
        where: { placeId, status: 'active', ...(nfcTagId ? { id: String(nfcTagId) } : {}) }
      });
      if (!tag) {
        return res.status(409).json({ success: false, message: 'Este local aún no tiene un tag NFC activo.' });
      }

      const distanceMeters = hasGps
        ? Math.round(calculateDistanceKm(userLat, userLng, place.latitude, place.longitude) * 1000)
        : 0;
      if (distanceMeters > getCheckInMaxDistanceMeters() && !isRemoteCheckInAllowed()) {
        return res.status(403).json({
          success: false,
          message: `Debes estar en ${place.name} para registrar la visita (estás a ${distanceMeters} m).`
        });
      }

      // Anti-farming: one rewarded check-in per user and place within the cooldown window
      const cooldownStart = new Date(Date.now() - CHECKIN_COOLDOWN_HOURS * 60 * 60 * 1000);
      const recentVisit = await prisma.visit.findFirst({
        where: { userId, placeId, date: { gte: cooldownStart } }
      });
      if (recentVisit) {
        return res.status(429).json({
          success: false,
          message: `Ya registraste una visita en ${place.name} hace poco. Podrás volver a hacerlo en ${CHECKIN_COOLDOWN_HOURS} horas.`
        });
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const scansToday = await prisma.checkIn.count({ where: { nfcTagId: tag.id, timestamp: { gte: startOfDay } } });
      if (scansToday >= tag.dailyScansLimit) {
        return res.status(429).json({ success: false, message: 'Este tag NFC alcanzó su límite diario de escaneos.' });
      }

      const isFirstVisit = (await prisma.visit.count({ where: { userId, placeId } })) === 0;
      const welcomeReward = isFirstVisit
        ? await prisma.welcomeReward.findFirst({ where: { placeId, active: true } })
        : null;
      const pointsAwarded = isFirstVisit
        ? POINTS.FIRST_VISIT + (welcomeReward?.bonusPoints ?? 0)
        : POINTS.RETURN_VISIT;

      const { checkIn, visit } = await prisma.$transaction(async tx => {
        const checkIn = await tx.checkIn.create({
          data: {
            userId,
            nfcTagId: tag.id,
            pointsAwarded,
            latitude: hasGps ? userLat : place.latitude,
            longitude: hasGps ? userLng : place.longitude,
            accuracyMeters: Number(req.body.accuracyMeters) || 0,
            distanceMeters,
            deviceInfo: typeof req.body.deviceInfo === 'string' ? req.body.deviceInfo.slice(0, 200) : null,
            validationStatus: 'VERIFIED'
          }
        });
        const visit = await tx.visit.create({
          data: {
            checkInId: checkIn.id,
            userId,
            placeId,
            nfcTagId: tag.id,
            status: 'active',
            isFirstVisit,
            pointsEarned: pointsAwarded
          }
        });
        if (welcomeReward) {
          await tx.welcomeRedemption.create({ data: { visitId: visit.id, welcomeRewardId: welcomeReward.id } });
        }
        await tx.pointTransaction.create({
          data: {
            userId,
            amount: pointsAwarded,
            reason: isFirstVisit ? 'FIRST_VISIT' : 'RETURN_VISIT',
            description: `Visita verificada en ${place.name}`
          }
        });
        await tx.user.update({ where: { id: userId }, data: { pointsBalance: { increment: pointsAwarded } } });
        await tx.place.update({ where: { id: placeId }, data: { verifiedVisits: { increment: 1 } } });
        await tx.nfcTag.update({
          where: { id: tag.id },
          data: { totalScans: { increment: 1 }, lastScannedAt: new Date() }
        });
        return { checkIn, visit };
      });

      return res.json({
        success: true,
        message: isFirstVisit
          ? `¡Bienvenido/a por primera vez a ${place.name}! Ganaste ${pointsAwarded} puntos.`
          : `¡Check-In NFC verificado en ${place.name}! Ganaste ${pointsAwarded} puntos.`,
        checkIn,
        visit: { ...visit, placeName: place.name, date: visit.date.toISOString() },
        welcomeReward,
        isFirstVisit,
        pointsAwarded
      });
    }

    // In-memory demo mode
    const place = db.getPlaceById(placeId);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Lugar no encontrado.' });
    }
    const result = db.createHybridCheckIn({
      placeId,
      userId,
      nfcTagId: nfcTagId || place.nfcTagId,
      userLat: hasGps ? userLat : place.location.latitude,
      userLng: hasGps ? userLng : place.location.longitude
    });
    const pointsAwarded = result.visit.pointsEarned;

    return res.json({
      success: true,
      message: result.visit.isFirstVisit
        ? `¡Bienvenido/a por primera vez a ${place.name}! Ganaste ${pointsAwarded} puntos.`
        : `¡Check-In NFC verificado en ${place.name}! Ganaste ${pointsAwarded} puntos.`,
      checkIn: result.checkIn,
      visit: result.visit,
      welcomeReward: result.welcomeReward,
      isFirstVisit: result.visit.isFirstVisit,
      pointsAwarded
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/checkins/visits - Visit history of the authenticated user only
checkInsRouter.get('/visits', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    if (getIsDbConnected()) {
      const visits = await prisma.visit.findMany({
        where: { userId },
        include: { place: { select: { name: true } } },
        orderBy: { date: 'desc' }
      });
      const formatted = visits.map(({ place, ...v }) => ({ ...v, placeName: place.name, date: v.date.toISOString() }));
      return res.json({ success: true, count: formatted.length, visits: formatted });
    }
    const visits = db.getVisits().filter(v => v.userId === userId);
    return res.json({ success: true, count: visits.length, visits });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
