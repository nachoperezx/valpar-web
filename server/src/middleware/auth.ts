import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret, isProduction } from '../config';
import { prisma, getIsDbConnected } from '../prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token de sesión inválido o expirado.' });
  }
}

// Requires an authenticated VALPAR_ADMIN. The role is read from the database rather
// than the token, so revoking a role takes effect without waiting for token expiry.
export async function requireValparAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Autenticación requerida.' });
  }

  try {
    if (getIsDbConnected()) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (user?.role !== 'VALPAR_ADMIN') {
        return res.status(403).json({ success: false, message: 'Acceso denegado: se requiere rol de administrador VALPAR.' });
      }
      return next();
    }

    // In-memory demo mode has no user store: only allowed outside production
    if (isProduction()) {
      return res.status(503).json({ success: false, message: 'Base de datos no disponible.' });
    }
    return next();
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
