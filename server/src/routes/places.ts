import { Router, Request, Response } from 'express';
import { prisma, getIsDbConnected } from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { db } from '../db';

export const placesRouter = Router();

// Helper Haversine distance formula in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/places & GET /api/places/discovery - Public query for PUBLISHED places only (Section 56)
placesRouter.get(['/', '/discovery'], async (req: Request, res: Response) => {
  const { city, category, search } = req.query;

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const whereClause: any = {
        publicationStatus: 'PUBLISHED'
      };

      if (city && city !== 'all') {
        whereClause.city = { equals: String(city), mode: 'insensitive' };
      }

      if (category && category !== 'all') {
        whereClause.category = { equals: String(category), mode: 'insensitive' };
      }

      if (search) {
        const query = String(search);
        whereClause.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { district: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } }
        ];
      }

      const placesFromDb = await prisma.place.findMany({
        where: whereClause,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      });

      const places = placesFromDb.map(p => ({
        id: p.id,
        partnerId: p.partnerId || undefined,
        status: p.status,
        publicationStatus: p.publicationStatus,
        verificationStatus: p.verificationStatus,
        dataSource: p.dataSource,
        name: p.name,
        slug: p.slug || p.id,
        tagline: p.tagline,
        description: p.description,
        shortDescription: p.shortDescription,
        category: p.category,
        subCategory: p.subCategory || undefined,
        categories: p.categories,
        imageUrl: p.imageUrl,
        coverPhoto: p.coverPhoto,
        gallery: p.gallery,
        
        // Honest Ratings (Nullable if 0 reviews - Section 3)
        rating: p.reviewCount > 0 ? p.rating : null,
        editorialScore: p.editorialScore,
        reviewCount: p.reviewCount,
        verifiedVisits: p.verifiedVisits,
        priceLevel: p.priceLevel,
        location: {
          address: p.address,
          city: p.city,
          district: p.district,
          commune: p.commune || p.district,
          region: p.region,
          latitude: p.latitude,
          longitude: p.longitude,
          zone: p.zone
        },
        openingHours: p.openingHours,
        phone: p.phone || undefined,
        publicEmail: p.publicEmail || undefined,
        website: p.website || undefined,
        instagram: p.instagram || undefined,
        facebook: p.facebook || undefined,
        tiktok: p.tiktok || undefined,
        whatsapp: p.whatsapp || undefined,
        isFeatured: p.isFeatured,
        isRecommended: p.isRecommended,
        currentOffer: p.currentOffer || undefined,
        experienceTags: p.experienceTags
      }));

      return res.json({ success: true, source: 'POSTGRESQL_PRISMA', count: places.length, places });
    } else {
      let places = db.getPlaces();
      return res.json({ success: true, source: 'MEMORY_FALLBACK', count: places.length, places });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/places/nearby - Geospatial query returning PUBLISHED places sorted by distance (Section 29)
placesRouter.get('/nearby', async (req: Request, res: Response) => {
  const { lat, lng, radius, category } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Parámetros lat y lng obligatorios.' });
  }

  const userLat = Number(lat);
  const userLng = Number(lng);
  const maxRadiusKm = Number(radius) || 30;

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const placesFromDb = await prisma.place.findMany({
        where: {
          publicationStatus: 'PUBLISHED',
          ...(category && category !== 'all' ? { category: String(category) } : {})
        }
      });

      const nearbyPlaces = placesFromDb
        .map(p => {
          const distanceKm = calculateDistanceKm(userLat, userLng, p.latitude, p.longitude);
          return {
            id: p.id,
            partnerId: p.partnerId || undefined,
            status: p.status,
            publicationStatus: p.publicationStatus,
            verificationStatus: p.verificationStatus,
            name: p.name,
            slug: p.slug || p.id,
            category: p.category,
            categories: p.categories,
            tagline: p.tagline,
            experienceTags: p.experienceTags,
            priceLevel: p.priceLevel,
            shortDescription: p.shortDescription || p.tagline,
            rating: p.reviewCount > 0 ? p.rating : null,
            editorialScore: p.editorialScore,
            reviewCount: p.reviewCount,
            imageUrl: p.imageUrl,
            coverPhoto: p.coverPhoto,
            latitude: p.latitude,
            longitude: p.longitude,
            location: {
              address: p.address,
              city: p.city,
              district: p.district,
              commune: p.commune || p.district,
              latitude: p.latitude,
              longitude: p.longitude,
              zone: p.zone
            },
            distanceKm: Number(distanceKm.toFixed(2))
          };
        })
        .filter(p => p.distanceKm <= maxRadiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      return res.json({ success: true, source: 'POSTGRESQL_GEOSPATIAL', count: nearbyPlaces.length, places: nearbyPlaces });
    } else {
      const places = db.getPlaces().map(p => {
        const distanceKm = calculateDistanceKm(userLat, userLng, p.location.latitude, p.location.longitude);
        return { ...p, distanceKm: Number(distanceKm.toFixed(2)) };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      return res.json({ success: true, source: 'MEMORY_GEOSPATIAL', count: places.length, places });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/places/:id - Public place details by ID or Slug (Must be PUBLISHED)
placesRouter.get('/:id', async (req: Request, res: Response) => {
  const targetId = req.params.id;

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const place = await prisma.place.findFirst({
        where: {
          OR: [{ id: targetId }, { slug: targetId }],
          publicationStatus: 'PUBLISHED'
        },
        include: { products: true, welcomeRewards: true, media: true }
      });

      if (!place) {
        return res.status(404).json({ success: false, message: 'Lugar no encontrado o no publicado.' });
      }

      const formattedPlace = {
        id: place.id,
        partnerId: place.partnerId || undefined,
        status: place.status,
        publicationStatus: place.publicationStatus,
        verificationStatus: place.verificationStatus,
        dataSource: place.dataSource,
        name: place.name,
        slug: place.slug || place.id,
        tagline: place.tagline,
        description: place.description,
        shortDescription: place.shortDescription,
        category: place.category,
        subCategory: place.subCategory || undefined,
        categories: place.categories,
        imageUrl: place.imageUrl,
        coverPhoto: place.coverPhoto,
        gallery: place.gallery,
        media: place.media,
        
        // Honest Ratings (Nullable if no reviews exist)
        rating: place.reviewCount > 0 ? place.rating : null,
        editorialScore: place.editorialScore,
        reviewCount: place.reviewCount,
        verifiedVisits: place.verifiedVisits,
        priceLevel: place.priceLevel,
        location: {
          address: place.address,
          city: place.city,
          district: place.district,
          commune: place.commune || place.district,
          region: place.region,
          latitude: place.latitude,
          longitude: place.longitude,
          zone: place.zone
        },
        openingHours: place.openingHours,
        phone: place.phone || undefined,
        publicEmail: place.publicEmail || undefined,
        website: place.website || undefined,
        instagram: place.instagram || undefined,
        facebook: place.facebook || undefined,
        tiktok: place.tiktok || undefined,
        whatsapp: place.whatsapp || undefined,
        isFeatured: place.isFeatured,
        isRecommended: place.isRecommended,
        currentOffer: place.currentOffer || undefined,
        experienceTags: place.experienceTags,
        menu: place.products
      };

      return res.json({ success: true, source: 'POSTGRESQL_PRISMA', place: formattedPlace });
    } else {
      const place = db.getPlaceById(targetId);
      if (!place) {
        return res.status(404).json({ success: false, message: 'Lugar no encontrado.' });
      }
      return res.json({ success: true, source: 'MEMORY_FALLBACK', place });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/places/skipped - Record skipped place for user (Section 34 & 45)
placesRouter.post('/skipped', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { placeId } = req.body;
  const userId = req.user?.id;

  if (!placeId || !userId) {
    return res.status(400).json({ success: false, message: 'Falta placeId y usuario.' });
  }

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      await prisma.placeSkipped.upsert({
        where: { userId_placeId: { userId, placeId } },
        update: {},
        create: { userId, placeId }
      });

      await prisma.placeInteractionEvent.create({
        data: {
          placeId,
          userId,
          eventType: 'PLACE_SKIPPED'
        }
      });

      return res.json({ success: true, message: 'Lugar registrado como omitido en PostgreSQL.' });
    }

    return res.json({ success: true, message: 'Lugar registrado como omitido.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/places/favorites - Save/Toggle Favorite Place in PostgreSQL (Section 33 & 44)
placesRouter.post('/favorites', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { placeId } = req.body;
  const userId = req.user?.id;

  if (!placeId || !userId) {
    return res.status(400).json({ success: false, message: 'Falta placeId y usuario autenticado.' });
  }

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const existing = await prisma.favorite.findUnique({
        where: { userId_placeId: { userId, placeId } }
      });

      if (existing) {
        await prisma.favorite.delete({
          where: { userId_placeId: { userId, placeId } }
        });
        return res.json({ success: true, isFavorite: false, message: 'Lugar removido de tus Favoritos.' });
      } else {
        await prisma.favorite.create({
          data: { userId, placeId }
        });

        await prisma.placeInteractionEvent.create({
          data: {
            placeId,
            userId,
            eventType: 'PLACE_SAVED'
          }
        });

        return res.json({ success: true, isFavorite: true, message: '¡Lugar guardado en tus Favoritos de PostgreSQL!' });
      }
    }

    return res.json({ success: true, isFavorite: true, message: 'Favorito actualizado en memoria.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/places/favorites/me - List user's saved favorites
placesRouter.get('/favorites/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Autenticación requerida.' });
  }

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: { place: true },
        orderBy: { createdAt: 'desc' }
      });

      const favoritePlaces = favorites.map(f => f.place);
      return res.json({ success: true, count: favoritePlaces.length, places: favoritePlaces });
    } else {
      // Favorites are not stored in memory mode; returning every place would be misleading
      return res.json({ success: true, count: 0, places: [] });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
