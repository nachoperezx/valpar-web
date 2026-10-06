import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

let isDbConnected = false;

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    console.log('✅ PostgreSQL Database connection established successfully via Prisma.');
    return true;
  } catch (error: any) {
    isDbConnected = false;
    console.warn('⚠️ PostgreSQL DB connection not available. Reason:', error.message || error);
    console.warn('📌 Application operating in Graceful Fallback Mode (Seed Data Active).');
    return false;
  }
}

export function getIsDbConnected(): boolean {
  return isDbConnected;
}
