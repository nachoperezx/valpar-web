import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, getIsDbConnected } from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { db } from '../db';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'valpar_jwt_secret_v0.3.0_key_regional_2026';

// Helper to generate JWT Token
function generateToken(user: { id: string; email: string; name: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Verifies a Google ID token with Google and returns its claims, or null if invalid.
// The token audience must match one of the configured OAuth client IDs.
async function verifyGoogleIdToken(idToken: string, allowedClientIds: string[]) {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) return null;
  const claims = await res.json() as { aud?: string; sub?: string; email?: string; email_verified?: string | boolean; name?: string; picture?: string };
  if (!claims.sub || !claims.email || !claims.aud || !allowedClientIds.includes(claims.aud)) return null;
  if (claims.email_verified !== true && claims.email_verified !== 'true') return null;
  return { googleId: claims.sub, email: claims.email, name: claims.name, avatarUrl: claims.picture };
}

// POST /api/auth/register - Create account (Email & Password)
authRouter.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son obligatorios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const isDb = getIsDbConnected();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isDb) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'El correo electrónico ya se encuentra registrado.' });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          passwordHash: hashedPassword,
          role: 'CONSUMER',
          pointsBalance: 100 // Welcome points
        }
      });

      const token = generateToken({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role });

      return res.status(201).json({
        success: true,
        message: '¡Registro exitoso! Bienvenido a Valpar.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          points: newUser.pointsBalance,
          passportLevel: newUser.passportLevel,
          visitedPlacesCount: 0,
          avatarUrl: newUser.avatarUrl
        }
      });
    } else {
      // In-Memory Fallback
      const existing = db.getCustomerProfiles().find(c => c.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'El correo ya existe en el sistema.' });
      }

      const userId = `user-reg-${Date.now()}`;
      const mockUser = {
        id: userId,
        name,
        email,
        phone: phone || '+56900000000',
        role: 'CONSUMER',
        points: 100,
        visitedPlacesCount: 0,
        passportLevel: 'Explorador Porteño',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };

      const token = generateToken({ id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role });

      return res.status(201).json({
        success: true,
        message: '¡Registro exitoso! (Modo desarrollo activos)',
        token,
        user: mockUser
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Error al procesar el registro.' });
  }
});

// POST /api/auth/login - Email & Password Login
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Ingrese email y contraseña.' });
  }

  try {
    const isDb = getIsDbConnected();

    if (isDb) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
      }

      const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

      return res.json({
        success: true,
        message: `¡Bienvenido de nuevo, ${user.name}!`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: user.pointsBalance,
          passportLevel: user.passportLevel,
          visitedPlacesCount: await prisma.visit.count({ where: { userId: user.id } }),
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      // In-Memory Fallback
      if (email === 'valentina.silva@email.cl' || email.includes('@')) {
        const mockUser = {
          id: 'user-valpo-01',
          name: 'Valentina Silva',
          email,
          phone: '+56987654321',
          role: 'CONSUMER',
          points: 450,
          visitedPlacesCount: 4,
          passportLevel: 'Explorador Porteño',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
        };

        const token = generateToken({ id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role });

        return res.json({
          success: true,
          message: `¡Bienvenido de nuevo!`,
          token,
          user: mockUser
        });
      }

      return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Error en el servidor.' });
  }
});

// GET /api/auth/me - Authenticated user profile
authRouter.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isDb = getIsDbConnected();

    if (isDb && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          pointsBalance: true,
          passportLevel: true,
          avatarUrl: true,
          role: true
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: user.pointsBalance,
          passportLevel: user.passportLevel,
          visitedPlacesCount: await prisma.visit.count({ where: { userId: user.id } }),
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      return res.json({
        success: true,
        user: {
          id: req.user?.id || 'user-valpo-01',
          name: req.user?.name || 'Valentina Silva',
          email: req.user?.email || 'valentina.silva@email.cl',
          phone: '+56987654321',
          points: 450,
          visitedPlacesCount: 4,
          passportLevel: 'Explorador Porteño',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
        }
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/google - OAuth Google Sign In / Registration
authRouter.post('/google', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  const allowedClientIds = [
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID
  ].filter((id): id is string => !!id);

  if (allowedClientIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'BLOQUEADO POR CONFIGURACIÓN: Falta variable de entorno EXPO_PUBLIC_GOOGLE_CLIENT_ID para el flujo Google OAuth real.',
      code: 'MISSING_GOOGLE_CLIENT_ID_CONFIG'
    });
  }

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Falta payload de autenticación Google.' });
  }

  try {
    // Identity comes only from the verified token, never from client-supplied fields
    const googleProfile = await verifyGoogleIdToken(String(idToken), allowedClientIds);
    if (!googleProfile) {
      return res.status(401).json({ success: false, message: 'Token de Google inválido.' });
    }
    const { googleId, email, name, avatarUrl } = googleProfile;

    const isDb = getIsDbConnected();

    if (isDb) {
      let user = await prisma.user.findFirst({
        where: { OR: [{ googleId }, { email }] }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || 'Usuario Google',
            email,
            googleId,
            avatarUrl,
            role: 'CONSUMER',
            pointsBalance: 150
          }
        });
      } else if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatarUrl: avatarUrl || user.avatarUrl }
        });
      }

      const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

      return res.json({
        success: true,
        message: `¡Sesión Google iniciada como ${user.name}!`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: user.pointsBalance,
          passportLevel: user.passportLevel,
          visitedPlacesCount: await prisma.visit.count({ where: { userId: user.id } }),
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      const mockUser = {
        id: `user-google-${googleId.slice(0, 6)}`,
        name: name || 'Usuario Google',
        email,
        phone: '+56900000000',
        role: 'CONSUMER',
        points: 150,
        visitedPlacesCount: 1,
        passportLevel: 'Explorador Porteño',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };

      const token = generateToken({ id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role });

      return res.json({
        success: true,
        message: `Sesión Google iniciada exitosamente`,
        token,
        user: mockUser
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/logout - Logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Sesión cerrada exitosamente.' });
});
