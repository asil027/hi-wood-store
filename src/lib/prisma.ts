import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL;

  // On Vercel / serverless environments, copy SQLite to /tmp so it is fully writable
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const srcDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    if (!fs.existsSync(tmpDbPath) && fs.existsSync(srcDbPath)) {
      try {
        fs.copyFileSync(srcDbPath, tmpDbPath);
      } catch (e) {
        console.error('Failed copying database to /tmp:', e);
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      dbUrl = `file:${tmpDbPath}`;
    }
  }

  return new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

