// Centralized runtime configuration. Values are read lazily so they always
// reflect process.env after dotenv has loaded.

const DEV_JWT_SECRET = 'valpar-dev-only-jwt-secret';
let warnedAboutDevSecret = false;

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  if (isProduction()) {
    throw new Error('JWT_SECRET no está configurado. Es obligatorio en producción.');
  }
  if (!warnedAboutDevSecret) {
    console.warn('⚠️ JWT_SECRET no definido: usando una clave solo para desarrollo. Defínelo en server/.env.');
    warnedAboutDevSecret = true;
  }
  return DEV_JWT_SECRET;
}

// Max distance (meters) between the user's GPS and the place for a valid check-in.
export function getCheckInMaxDistanceMeters(): number {
  return Number(process.env.CHECKIN_MAX_DISTANCE_METERS) || 150;
}

// Development escape hatch to test check-ins without being physically at the place.
export function isRemoteCheckInAllowed(): boolean {
  return !isProduction() && process.env.ALLOW_REMOTE_CHECKIN === 'true';
}

// Minimum hours between two rewarded check-ins of the same user at the same place.
export const CHECKIN_COOLDOWN_HOURS = 12;

export const POINTS = {
  FIRST_VISIT: 100,
  RETURN_VISIT: 50
};
