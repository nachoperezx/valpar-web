import { Router, Request, Response } from 'express';
import { db } from '../db';

export const ordersRouter = Router();

// POST /api/orders - Create digital order linked to Visit (Supports VALPAR_INTERNAL or EXTERNAL_POS)
ordersRouter.post('/', (req: Request, res: Response) => {
  const { visitId, placeId, placeName, customerId, customerName, items, source, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'El pedido no contiene ítems.' });
  }

  const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const tip = Math.round(subtotal * 0.1);
  const total = subtotal + tip;

  const newOrder = db.createOrder({
    visitId,
    placeId,
    placeName: placeName || db.getPlaceById(placeId)?.name || '',
    customerId: customerId || '',
    customerName: customerName || '',
    items,
    subtotal,
    tip,
    total,
    source: source === 'EXTERNAL_POS' ? 'EXTERNAL_POS' : 'VALPAR_INTERNAL',
    paymentMethod: paymentMethod || 'webpay'
  });

  res.json({
    success: true,
    message: 'Pedido pagado y registrado exitosamente.',
    order: newOrder
  });
});

// POST /api/orders/review - Refactored Transparent Review Submission (Punto 3: No artificial filtering)
ordersRouter.post('/review', (req: Request, res: Response) => {
  const { visitId, placeId, userId, userName, rating, comment } = req.body;

  const review = db.addReview({
    visitId: visitId || 'visit-init-01',
    placeId: placeId || 'place-01',
    userId: userId || 'user-valpo-01',
    userName: userName || 'Valentina Silva',
    rating: Number(rating) || 5,
    comment: comment || ''
  });

  res.json({
    success: true,
    message: 'Reseña registrada transparentemente.',
    review
  });
});
