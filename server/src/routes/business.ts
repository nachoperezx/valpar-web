import { Router, Response, NextFunction } from 'express';
import { prisma, getIsDbConnected } from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

export const businessRouter = Router();

export interface BusinessAuthRequest extends AuthRequest {
  partnerId?: string;
  businessRole?: 'OWNER' | 'MANAGER' | 'STAFF';
}

// Middleware: Require Business Partner Authorization (Part 17 & Test Case 5)
async function requireBusinessAccess(req: BusinessAuthRequest, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const requestedPartnerId = req.params.partnerId || req.body.partnerId || req.query.partnerId;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Autenticación requerida.' });
  }

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      // Check if user is a member of the requested BusinessPartner
      const membership = await prisma.partnerMember.findFirst({
        where: {
          userId,
          ...(requestedPartnerId ? { partnerId: String(requestedPartnerId) } : {})
        },
        include: { partner: true }
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          code: 'BUSINESS_ACCESS_DENIED',
          message: 'Acceso Denegado (403): El usuario autenticado no posee membresía autorizada en este restaurante/empresa.'
        });
      }

      req.partnerId = membership.partnerId;
      req.businessRole = membership.role as any;
      next();
    } else {
      req.partnerId = 'partner-turri';
      req.businessRole = 'OWNER';
      next();
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

businessRouter.use(authenticateToken);

// GET /api/business/me - Business Profile & Active Role
businessRouter.get('/me', requireBusinessAccess, async (req: BusinessAuthRequest, res: Response) => {
  try {
    const isDb = getIsDbConnected();

    if (isDb && req.partnerId) {
      const partner = await prisma.businessPartner.findUnique({
        where: { id: req.partnerId },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
      });

      return res.json({
        success: true,
        role: req.businessRole,
        partner
      });
    }

    return res.json({
      success: true,
      role: 'OWNER',
      partner: { id: 'partner-turri', name: 'Grupo Gastronómico Turri', planTier: 'PARTNER_PRO' }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/business/places - List Places belonging strictly to authenticated partner
businessRouter.get('/places', requireBusinessAccess, async (req: BusinessAuthRequest, res: Response) => {
  try {
    const isDb = getIsDbConnected();

    if (isDb && req.partnerId) {
      const places = await prisma.place.findMany({
        where: { partnerId: req.partnerId },
        include: { products: true, nfcTags: true }
      });

      return res.json({ success: true, count: places.length, places });
    } else {
      return res.json({
        success: true,
        count: 1,
        places: [
          {
            id: 'place-01',
            name: 'Café Turri',
            status: 'PARTNER',
            partnerId: 'partner-turri'
          }
        ]
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/business/places/:id - Edit commercial place info (Part 51)
businessRouter.patch('/places/:id', async (req: BusinessAuthRequest, res: Response) => {
  const targetPlaceId = req.params.id;
  const userId = req.user?.id;

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const place = await prisma.place.findUnique({ where: { id: targetPlaceId } });
      if (!place || !place.partnerId) {
        return res.status(404).json({ success: false, message: 'Lugar comercial no encontrado.' });
      }

      // Security check: Validate user belongs to place.partnerId
      const membership = await prisma.partnerMember.findFirst({
        where: { userId, partnerId: place.partnerId }
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          code: 'FORBIDDEN_BUSINESS_EDIT',
          message: 'Acceso Denegado (403): No está autorizado para modificar información de este restaurante socio.'
        });
      }

      // Only allow commercial fields edit (description, photo, menu, hours, phone, website, socials)
      const allowedUpdates: any = {};
      const { description, tagline, openingHours, phone, website, instagram, facebook, currentOffer, imageUrl, gallery } = req.body;

      if (description !== undefined) allowedUpdates.description = description;
      if (tagline !== undefined) allowedUpdates.tagline = tagline;
      if (openingHours !== undefined) allowedUpdates.openingHours = openingHours;
      if (phone !== undefined) allowedUpdates.phone = phone;
      if (website !== undefined) allowedUpdates.website = website;
      if (instagram !== undefined) allowedUpdates.instagram = instagram;
      if (facebook !== undefined) allowedUpdates.facebook = facebook;
      if (currentOffer !== undefined) allowedUpdates.currentOffer = currentOffer;
      if (imageUrl !== undefined) allowedUpdates.imageUrl = imageUrl;
      if (gallery !== undefined) allowedUpdates.gallery = gallery;

      const updatedPlace = await prisma.place.update({
        where: { id: targetPlaceId },
        data: allowedUpdates
      });

      return res.json({
        success: true,
        message: 'Información comercial del restaurante actualizada con éxito en PostgreSQL.',
        place: updatedPlace
      });
    }

    return res.json({ success: true, message: 'Información actualizada en modo demo.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
