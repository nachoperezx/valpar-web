import { Router, Request, Response } from 'express';
import { prisma, getIsDbConnected } from '../prisma';

export const devRouter = Router();

// Middleware: Restrict dev endpoints in production
devRouter.use((req: Request, res: Response, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Endpoints de desarrollo no disponibles en producción.' });
  }
  next();
});

// GET /api/dev/test-place - Check if test place exists in PostgreSQL
devRouter.get('/test-place', async (req: Request, res: Response) => {
  try {
    const isDb = getIsDbConnected();
    if (!isDb) {
      return res.status(503).json({ success: false, message: 'Base de datos PostgreSQL no conectada.' });
    }

    const testPlaces = await prisma.place.findMany({
      where: { dataSource: 'SEED_DEVELOPMENT' }
    });

    return res.json({
      success: true,
      count: testPlaces.length,
      places: testPlaces,
      hasTestPlace: testPlaces.length > 0
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/dev/test-place - Create a single controlled test place in PostgreSQL
devRouter.post('/test-place', async (req: Request, res: Response) => {
  try {
    const isDb = getIsDbConnected();
    if (!isDb) {
      return res.status(503).json({ success: false, message: 'Base de datos PostgreSQL no conectada.' });
    }

    // 1. Clean up any existing SEED_DEVELOPMENT places first to avoid duplicates or slug conflicts
    await prisma.place.deleteMany({
      where: { dataSource: 'SEED_DEVELOPMENT' }
    });

    // 2. Create the controlled test place with exact requested specs
    const testPlace = await prisma.place.create({
      data: {
        name: '🧪 VALPAR TEST — Restaurante Demo',
        slug: `valpar-test-demo-${Date.now()}`,
        tagline: 'Restaurante Demo para QA Mobile',
        description: 'Lugar creado automáticamente para probar la integración móvil de VALPAR.',
        shortDescription: 'Lugar de prueba temporal de VALPAR Mobile',
        category: 'Restaurante',
        subCategory: 'Cocina de Autor',
        categories: ['Restaurante', 'Gourmet'],
        tags: ['test', 'demo', 'valpar-qa'],

        address: 'Av. Libertad 123',
        district: 'Cerro Alegre',
        commune: 'Viña del Mar',
        city: 'Viña del Mar',
        region: 'Valparaíso',
        country: 'Chile',
        latitude: -33.0245,
        longitude: -71.5518,

        rating: null,
        editorialScore: null,
        reviewCount: 0,
        verifiedVisits: 0,
        priceLevel: '$$',

        isFeatured: false,
        isRecommended: false,

        publicationStatus: 'PUBLISHED',
        verificationStatus: 'UNVERIFIED',
        dataSource: 'SEED_DEVELOPMENT',

        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        coverPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
        ]
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurante de prueba creado exitosamente en PostgreSQL.',
      place: testPlace
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/dev/test-place - Delete ONLY test places (dataSource = SEED_DEVELOPMENT) from PostgreSQL
devRouter.delete('/test-place', async (req: Request, res: Response) => {
  try {
    const isDb = getIsDbConnected();
    if (!isDb) {
      return res.status(503).json({ success: false, message: 'Base de datos PostgreSQL no conectada.' });
    }

    const deleteResult = await prisma.place.deleteMany({
      where: { dataSource: 'SEED_DEVELOPMENT' }
    });

    return res.json({
      success: true,
      message: 'Datos de prueba eliminados correctamente de PostgreSQL.',
      count: deleteResult.count
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
